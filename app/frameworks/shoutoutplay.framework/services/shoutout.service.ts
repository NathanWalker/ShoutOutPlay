// angular
import {Injectable} from '@angular/core';

// nativescript
import * as fs from 'file-system';

// libs
import {Store, ActionReducer, Action} from '@ngrx/store';
import {Observable} from 'rxjs/Observable';

// app
import {Analytics, AnalyticsService} from '../../analytics.framework/index';
import {LogService, ProgressService} from '../../core.framework/index';
import {ShoutoutModel, TrackModel, COUCHBASE_ACTIONS} from '../index';

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
      this.store.take(1).subscribe((state: any) => {
        let playlists = [...state.couchbase.playlists];  
        let shoutouts = [...state.couchbase.shoutouts];
        for (let i = 0; i < shoutouts.length; i++) {
          if (shoutouts[i].id === shoutout.id) {
            shoutouts[i].queueDelete = true;
            this.removeRecordings([shoutout.recordingPath]);
            break;
          }
        }
        // update track to clear shoutout
        for (let i = 0; i < playlists.length; i++) {
          for (let track of playlists[i].tracks) {
            if (track.shoutoutId === shoutout.tmpId) {
              track.shoutoutId = undefined;
              break;
            }
          }
        }
        this.store.dispatch({ type: COUCHBASE_ACTIONS.PROCESS_UPDATES, payload: { changes: { playlists, shoutouts } } });
        setTimeout(() => {
          resolve();
        }, 1000);
      });
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
    };
    if (recordingPaths.length) {
      deleteFile();
    }
  }
}