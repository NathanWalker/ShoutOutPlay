// angular
import {Injectable} from '@angular/core';

// nativescript
import * as fs from 'file-system';

// libs
import {Store, ActionReducer, Action} from '@ngrx/store';
import {Effect, toPayload, StateUpdates} from '@ngrx/effects';
import {Observable} from 'rxjs/Observable';
import {includes} from 'lodash';

// app
import {Analytics, AnalyticsService} from '../../analytics/index';
import {Config, LogService, ProgressService} from '../../core/index';
import {ShoutoutModel, TrackModel, FIREBASE_ACTIONS} from '../index';
import {FirebaseService} from './firebase.service';

// analytics
const CATEGORY: string = 'Shoutout';

/**
 * ngrx setup start --
 */
export interface ShoutoutStateI {
  list: Array<ShoutoutModel>;
  showTrackPicker?: boolean;
  showRecord?: boolean;
}

const initialState: ShoutoutStateI = {
  list: []
};

interface SHOUTOUT_ACTIONSI {
  SHOW_PICKER: string;
  CLOSE_PICKER: string;
  DOWNLOAD_SHOUTOUTS: string;
  REMOVE_REMOTE: string;
}

export const SHOUTOUT_ACTIONS: SHOUTOUT_ACTIONSI = {
  SHOW_PICKER: `[${CATEGORY}] SHOW_PICKER`,
  CLOSE_PICKER: `[${CATEGORY}] CLOSE_PICKER`,
  DOWNLOAD_SHOUTOUTS: `[${CATEGORY}] DOWNLOAD_SHOUTOUTS`,
  REMOVE_REMOTE: `[${CATEGORY}] REMOVE_REMOTE`
};

export const shoutoutReducer: ActionReducer<ShoutoutStateI> = (state: ShoutoutStateI = initialState, action: Action) => {
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
  private _downloadQueue: Array<string>;

  constructor(public analytics: AnalyticsService, private store: Store<any>, private logger: LogService, private loader: ProgressService, private firebaseService: FirebaseService) {
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
      if (!fs.File.exists(shoutout.recordingPath)) {
        let parts = shoutout.recordingPath.split('/');
        this._downloadQueue.push(parts[parts.length - 1]);
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

  public removeShoutout(shoutout: ShoutoutModel): Promise<any> {
    return new Promise((resolve) => {
      this.loader.show();
      this.removeRecordings([shoutout.recordingPath]);
      this.store.dispatch({ type: FIREBASE_ACTIONS.DELETE, payload: shoutout });
      setTimeout(() => {
        resolve();
      }, 1000);
    });
  }

  public removeRecordings(recordingPaths: Array<string>, shouldDeleteRemote?: boolean) {
    // reset quick record
    this.quickRecordTrack = undefined;
    
    console.log('removeRecordings');
    console.log(recordingPaths.length);
    let cnt = 0;
    let advance = () => {
      cnt++;
      if (cnt < recordingPaths.length) {
        deleteFile();
      } else if (shouldDeleteRemote) {
        // prepare to remove remotely
        cnt = 0;
        // convert to just filenames
        recordingPaths = recordingPaths.map((path) => {
          let parts = path.split('/');
          return parts[parts.length - 1];   
        });
        // delete remotely
        deleteRemote();
      }
    };
    let deleteHandler = () => {
      cnt++;
      deleteRemote();
    };
    let deleteRemote = () => {
      if (cnt < recordingPaths.length) {
        this.removeRemote(recordingPaths[cnt]).then(deleteHandler, deleteHandler);
      }
    };
    let deleteFile = () => {
      let filePath = recordingPaths[cnt];
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
    if (recordingPaths.length) {
      deleteFile();
    }
  }
}

@Injectable()
export class ShoutoutEffects {
  constructor(private store: Store<any>, private logger: LogService, private updates$: StateUpdates<any>, private shoutoutService: ShoutoutService) { }
  
  @Effect() downloadShoutouts$ = this.updates$
    .whenAction(SHOUTOUT_ACTIONS.DOWNLOAD_SHOUTOUTS)
    .do((update) => {
      this.logger.debug(`ShoutoutEffects.DOWNLOAD_SHOUTOUTS`);
      this.shoutoutService.downloadShoutouts(update.action.payload);
    })
    .filter(() => false);
  
  @Effect() removeRemote$ = this.updates$
    .whenAction(SHOUTOUT_ACTIONS.REMOVE_REMOTE)
    .do((update) => {
      this.logger.debug(`ShoutoutEffects.REMOVE_REMOTE`);
      let handler = () => {
        this.logger.debug(`removeRemote handler. noop.`);
      };
      this.shoutoutService.removeRemote(update.action.payload).then(handler, handler);
    })
    .filter(() => false);
}