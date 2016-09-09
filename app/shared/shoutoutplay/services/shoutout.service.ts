// angular
import {Injectable, NgZone} from '@angular/core';

// nativescript
import * as fs from 'file-system';

// libs
import {Store, ActionReducer, Action} from '@ngrx/store';
import {Effect, Actions} from '@ngrx/effects';
import {Observable} from 'rxjs/Observable';
import {includes} from 'lodash';

// app
import {Analytics, AnalyticsService} from '../../analytics/index';
import {Config, LogService, ProgressService, Utils} from '../../core/index';
import {ShoutoutModel, TrackModel, FIREBASE_ACTIONS} from '../index';
import {FirebaseService} from './firebase.service';

// analytics
const CATEGORY: string = 'Shoutout';

/**
 * ngrx setup start --
 */
export interface IShoutoutState {
  list: Array<ShoutoutModel>;
  showTrackPicker?: boolean;
}

const initialState: IShoutoutState = {
  list: []
};

interface ISHOUTOUT_ACTIONS {
  SHOW_PICKER: string;
  CLOSE_PICKER: string;
  DOWNLOAD_SHOUTOUTS: string;
  REMOVE_REMOTE: string;
}

export const SHOUTOUT_ACTIONS: ISHOUTOUT_ACTIONS = {
  SHOW_PICKER: `${CATEGORY}_SHOW_PICKER`,
  CLOSE_PICKER: `${CATEGORY}_CLOSE_PICKER`,
  DOWNLOAD_SHOUTOUTS: `${CATEGORY}_DOWNLOAD_SHOUTOUTS`,
  REMOVE_REMOTE: `${CATEGORY}_REMOVE_REMOTE`
};

export const shoutoutReducer: ActionReducer<IShoutoutState> = (state: IShoutoutState = initialState, action: Action) => {
  let changeState = () => {
    return Object.assign({}, state, action.payload);
  };
  switch (action.type) {
    case SHOUTOUT_ACTIONS.SHOW_PICKER:
      action.payload = { showTrackPicker: true };
      return changeState();
    case SHOUTOUT_ACTIONS.CLOSE_PICKER:
      action.payload = { showTrackPicker: false };
      return changeState();
    default:
      return state;
  }
};
/**
 * ngrx end --
 */

@Injectable()
export class ShoutoutService extends Analytics {
  public quickRecordTrack: TrackModel;
  public savedName: string;
  private _downloadQueue: Array<string>;

  constructor(public analytics: AnalyticsService, private store: Store<any>, private logger: LogService, private loader: ProgressService, private firebaseService: FirebaseService, private ngZone: NgZone) {
    super(analytics);
    this.category = CATEGORY;
  }

  public isDownloading(filename: string) {
    if (this._downloadQueue && this._downloadQueue.length) {
      return includes(this._downloadQueue, filename);
    } else {
      return false;
    }
  }

  public downloadShoutouts(shoutouts: Array<ShoutoutModel>) {
    this._downloadQueue = [];
    for (let shoutout of shoutouts) {
      if (!fs.File.exists(Utils.documentsPath(shoutout.filename))) {
        this._downloadQueue.push(shoutout.filename);
      }
    }  
    let advance = () => {
      // keep removing first item in queue until empty
      this._downloadQueue.splice(0, 1);
      if (this._downloadQueue.length) {
        download();
      } else {
        this._downloadQueue = undefined;
      }
    };
    let download = () => {
      let filename = this._downloadQueue[0];
      // download file
      this.firebaseService.downloadFile(filename).then(advance, advance);
    };
    if (this._downloadQueue.length) {
      this.logger.debug(`preparing to download Shoutouts...`);
      download();
    }
  }

  public removeRemote(filename: string): Promise<any> {
    return this.firebaseService.deleteFile(filename);
  }

  public removeRemoteComplete() {
    this.ngZone.run(() => {
      this.loader.hide();
      this.store.dispatch({type: FIREBASE_ACTIONS.UPDATE});
    });
  }

  public removeShoutout(shoutout: ShoutoutModel): Promise<any> {
    return new Promise((resolve) => {
      this.loader.show();
      this.removeRecordings([shoutout.filename]);
      this.store.dispatch({ type: FIREBASE_ACTIONS.DELETE, payload: shoutout });
      setTimeout(() => {
        resolve();
      }, 1000);
    });
  }

  public removeRecordings(filenames: Array<string>, shouldDeleteRemote?: boolean) {
    // reset quick record
    this.quickRecordTrack = undefined;
    
    console.log('removeRecordings');
    console.log(filenames.length);
    let cnt = 0;
    let advance = () => {
      cnt++;
      if (cnt < filenames.length) {
        deleteFile();
      } else if (shouldDeleteRemote) {
        // prepare to remove remotely
        cnt = 0;
        // delete remotely
        deleteRemote();
      }
    };
    let deleteHandler = () => {
      cnt++;
      deleteRemote();
    };
    let deleteRemote = () => {
      if (cnt < filenames.length) {
        this.removeRemote(filenames[cnt]).then(deleteHandler, deleteHandler);
      }
    };
    let deleteFile = () => {
      let filename = filenames[cnt];
      let filePath = Utils.documentsPath(filename);
      if (fs.File.exists(filePath)) {
        console.log(`removing file: ${filePath}`);
        let nsFile = fs.File.fromPath(filePath);
        if (nsFile) {
          nsFile.remove().then(() => {
            advance();
          }, () => {
            advance();
          });
        } else {
          advance();
        }  
      } else {
        advance();
      }
    };
    if (filenames.length) {
      deleteFile();
    }
  }
}

@Injectable()
export class ShoutoutEffects {
  constructor(private store: Store<any>, private logger: LogService, private actions$: Actions, private shoutoutService: ShoutoutService) { }
  
  @Effect() downloadShoutouts$ = this.actions$
    .ofType(SHOUTOUT_ACTIONS.DOWNLOAD_SHOUTOUTS)
    .do((action) => {
      this.logger.debug(`ShoutoutEffects.DOWNLOAD_SHOUTOUTS`);
      this.shoutoutService.downloadShoutouts(action.payload);
    })
    .filter(() => false);
  
  @Effect() removeRemote$ = this.actions$
    .ofType(SHOUTOUT_ACTIONS.REMOVE_REMOTE)
    .do((action) => {
      this.logger.debug(`ShoutoutEffects.REMOVE_REMOTE`);
      let handler = () => {
        this.shoutoutService.removeRemoteComplete();
      };
      this.shoutoutService.removeRemote(action.payload).then(handler, handler);
    })
    .filter(() => false);
}