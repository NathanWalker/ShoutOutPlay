// angular
import {Injectable} from '@angular/core';

// nativescript
import * as fs from 'file-system';

// libs
import {Store, ActionReducer, Action} from '@ngrx/store';
import {Observable} from 'rxjs/Observable';

// app
import {Analytics, AnalyticsService} from '../../analytics/index';
import {LogService, ProgressService} from '../../core/index';
import {ShoutoutModel, TrackModel, FIREBASE_ACTIONS} from '../index';

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
}

export const SHOUTOUT_ACTIONS: SHOUTOUT_ACTIONSI = {
  SHOW_PICKER: `[${CATEGORY}] SHOW_PICKER`,
  CLOSE_PICKER: `[${CATEGORY}] CLOSE_PICKER`
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

  constructor(public analytics: AnalyticsService, private store: Store<any>, private logger: LogService, private loader: ProgressService) {
    super(analytics);
    this.category = CATEGORY;
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

  public removeRecordings(recordingPaths: Array<string>) {
    // reset quick record
    this.quickRecordTrack = undefined;
    
    console.log('removeRecordings');
    console.log(recordingPaths.length);
    let cnt = 0;
    let advance = () => {
      cnt++;
      if (cnt < recordingPaths.length) {
        deleteFile();
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