// angular
import {Injectable, NgZone, forwardRef, Inject, Injector} from '@angular/core';

// nativescript
import {RouterExtensions} from "nativescript-angular";
import {isIOS} from 'platform';
import * as dialogs from 'ui/dialogs';
import * as fs from 'file-system';

// libs
import {Store, ActionReducer, Action} from '@ngrx/store';
import {Effect, Actions} from '@ngrx/effects';
import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/observable/of';
import {isString, includes} from 'lodash';

// app
import {Analytics, AnalyticsService} from '../../analytics/index';
import {Config, LogService, FancyAlertService, Utils} from '../../core/index';
import {FirebaseService, PlaylistModel, TrackModel, SharedModel, PLAYER_ACTIONS, FIREBASE_ACTIONS, SHOUTOUT_ACTIONS} from '../index';

// analytics
const CATEGORY: string = 'Sharedlist';

/**
 * ngrx setup start --
 */
export interface ISharedlistState {
  playing?: boolean;
}

interface ISHAREDLIST_ACTIONS {
  PLAY: string;
  LOOP_NEXT: string;
  SKIP_NEXT: string;
  SKIP_BACK: string;
  DOWNLOAD_SHOUTOUTS: string;
}

export const SHAREDLIST_ACTIONS: ISHAREDLIST_ACTIONS = {
  PLAY: `${CATEGORY}_PLAY`,
  LOOP_NEXT: `${CATEGORY}_LOOP_NEXT`,
  SKIP_NEXT: `${CATEGORY}_SKIP_NEXT`,
  SKIP_BACK: `${CATEGORY}_SKIP_BACK`,
  DOWNLOAD_SHOUTOUTS: `${CATEGORY}_DOWNLOAD_SHOUTOUTS`
};

export const sharedlistReducer: ActionReducer<ISharedlistState> = (state: ISharedlistState = {}, action: Action) => {
  let changeState = () => {
    return Object.assign({}, state, action.payload);
  };
  switch (action.type) {
    default:
      return state;
  }
};
/**
 * ngrx end --
 */

@Injectable()
export class SharedlistService extends Analytics {
  private _remoteFilePath: string;
  private _downloadQueue: Array<string>;

  constructor(public analytics: AnalyticsService, private store: Store<any>, private logger: LogService, private ngZone: NgZone, private fancyalert: FancyAlertService, private injector: Injector) {
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

  public goToAndPlay(shared: SharedModel) {
    // shared-list.component picks up the shared track from this observable
    Config.PLAY_SHARED$.next(shared);
    // using injector here due to some injection issue
    // similar: https://github.com/angular/angular/issues/10770
    // may be able to inject once above is solved
    let nav = this.injector.get(RouterExtensions);
    nav.navigate(['/home/shared'], { clearHistory: true });
  }

  public skipNextPrev(direction: number) {
    let sharedlist = [];
    let sharedIndex = -1;
    let shared: SharedModel;

    this.store.take(1).subscribe((s: any) => {
      let activeShoutOutPath = s.player.activeShoutOutPath;
      if (activeShoutOutPath) {
        sharedlist = [...s.firebase.sharedlist];
        for (let i = 0; i < sharedlist.length; i++) {
          if (sharedlist[i].remoteFilePath === activeShoutOutPath) {
            sharedIndex = i;
            this.logger.debug(`skipNextPrev, found indices, sharedIndex: ${sharedIndex}`);
            break;
          }
        }

        if (sharedlist.length && sharedIndex > -1) {
          if (direction) {
            // next track
            sharedIndex++;       
          } else {
            // prev track
            sharedIndex--;
          }

          let trackId;
          if (sharedIndex > -1 && sharedIndex < sharedlist.length) {
            shared = sharedlist[sharedIndex];
          } else {
            // start over from start
            shared = sharedlist[0];
          }
          
          let activeShoutOutPath: string = shared.remoteFilePath;
          
          this.ngZone.run(() => {
            this.store.dispatch({
              type: PLAYER_ACTIONS.LIST_TOGGLE_PLAY,
              payload: {
                trackId: shared.trackId,
                activeList: 'shared',
                playing: true,
                activeShoutOutPath
              }
            });
          });
        }
      }
    });  
  }

  public downloadSharedShoutouts(sharedlist: Array<SharedModel>) {
    this._downloadQueue = [];
    for (let share of sharedlist) {
      let filename = Utils.getFilename(share.remoteFilePath);
      if (!fs.File.exists(Utils.documentsPath(filename))) {
        this._downloadQueue.push(share.remoteFilePath);
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
      let fbService = this.injector.get(FirebaseService);
      fbService.downloadFile(filename, true).then(advance, advance);
    };
    if (this._downloadQueue.length) {
      this.logger.debug(`preparing to download Shoutouts...`);
      download();
    }
  }
}

@Injectable()
export class SharedlistEffects {
  constructor(private store: Store<any>, private logger: LogService, private actions$: Actions, private sharedlist: SharedlistService) { }
  
  @Effect({ dispatch: false }) downloadShoutouts$ = this.actions$
    .ofType(SHAREDLIST_ACTIONS.DOWNLOAD_SHOUTOUTS)
    .do((action) => {
      this.logger.debug(`SharedlistEffects.DOWNLOAD_SHOUTOUTS`);
      this.sharedlist.downloadSharedShoutouts(action.payload);
    });

  @Effect({ dispatch: false }) play$ = this.actions$
    .ofType(SHAREDLIST_ACTIONS.PLAY)
    .do((action) => {
      this.logger.debug(`SharedlistEffects.PLAY`);
      this.sharedlist.goToAndPlay(action.payload);
    });

  @Effect({ dispatch: false }) skipNext$ = this.actions$
    .ofType(SHAREDLIST_ACTIONS.SKIP_NEXT)
    .do((action) => {
      this.logger.debug(`SharedlistEffects.SKIP_NEXT`);
      this.sharedlist.skipNextPrev(1);
    });
  
  @Effect({ dispatch: false }) skipBack$ = this.actions$
    .ofType(SHAREDLIST_ACTIONS.SKIP_BACK)
    .do((action) => {
      this.logger.debug(`SharedlistEffects.SKIP_BACK`);
      this.sharedlist.skipNextPrev(0);
    });
  
  @Effect({ dispatch: false }) loopNext$ = this.actions$
    .ofType(SHAREDLIST_ACTIONS.LOOP_NEXT)
    .do((action) => {
      this.logger.debug(`SharedlistEffects.LOOP_NEXT`);
      this.sharedlist.skipNextPrev(1);
    });
}