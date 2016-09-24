// angular
import {Injectable, NgZone, forwardRef, Inject, Injector} from '@angular/core';
import {Router} from '@angular/router';

// nativescript
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

declare var zonedCallback: Function;

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

  public togglePlay(shared: SharedModel) {
    this.store.take(1).subscribe((s: any) => {
      this.logger.debug('SharedlistService.togglePlay: this.store.take(1).subscribe, should update sharedlist state');
      let sharedlist = [...s.firebase.sharedlist];
      let currentTrackId = s.player.currentTrackId;
      let playing = !s.player.playing; // new playing state is always assumed the opposite unless the following...
      if (shared) {
        if (shared.remoteFilePath !== this._remoteFilePath) {
          this._remoteFilePath = shared.remoteFilePath;
          // changing shared, always play new shared track
          playing = true;
        }
        // IMP: must come after above
        // always ensure currentTrackId is set to incoming track
        currentTrackId = shared.trackId;
      } 

      for (let t of sharedlist) {
        if (t.trackId === shared.trackId) {
          t.playing = playing;
        } else {
          t.playing = false;
        }
      }
      
      this.logger.debug(`sharedlist playing: ${playing}`);
      
      this.ngZone.run(() => {
        this.store.dispatch({ type: PLAYER_ACTIONS.TOGGLE_PLAY, payload: { currentTrackId, playing } });
        this.store.dispatch({ type: FIREBASE_ACTIONS.UPDATE, payload: { sharedlist } });
      });      
    });
  } 

  public goToAndPlay(shared: SharedModel) {
    Config.PLAY_SHARED$.next(shared);
    let router = this.injector.get(Router);
    this.logger.debug(router.navigate);
    for (let key in router) {
      this.logger.debug(`key: ${key}, ${router[key]}`);
    }
    router.navigate(['/home/shared']);
  }

  public skipNextPrev(direction: number) {
    let sharedlist = [];
    let trackIndex = -1;
    let track;

    this.store.take(1).subscribe((s: any) => {
      let currentTrackId = s.player.currentTrackId;
      if (currentTrackId) {
        sharedlist = [...s.firebase.sharedlist];
        for (let i = 0; i < sharedlist.length; i++) {
          if (sharedlist[i].id === currentTrackId) {
            trackIndex = i;
            this.logger.debug(`skipNextPrev, found indices, trackIndex: ${trackIndex}`);
            break;
          }
        }

        if (sharedlist.length && trackIndex > -1) {
          if (direction) {
            // next track
            trackIndex++;       
          } else {
            // prev track
            trackIndex--;
          }

          let trackId;
          if (trackIndex > -1 && trackIndex < sharedlist.length) {
            track = sharedlist[trackIndex];
          } else {
            // start over from start
            track = sharedlist[0];
          }
          this.togglePlay(track);
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
  
  @Effect() downloadShoutouts$ = this.actions$
    .ofType(SHAREDLIST_ACTIONS.DOWNLOAD_SHOUTOUTS)
    .do((action) => {
      this.logger.debug(`SharedlistEffects.DOWNLOAD_SHOUTOUTS`);
      this.sharedlist.downloadSharedShoutouts(action.payload);
    })
    .filter(() => false);

  @Effect() play$ = this.actions$
    .ofType(SHAREDLIST_ACTIONS.PLAY)
    .do((action) => {
      this.logger.debug(`SharedlistEffects.PLAY`);
      this.sharedlist.goToAndPlay(action.payload);
    })
    .filter(() => false);

  @Effect() skipNext$ = this.actions$
    .ofType(SHAREDLIST_ACTIONS.SKIP_NEXT)
    .do((action) => {
      this.logger.debug(`SharedlistEffects.SKIP_NEXT`);
      this.sharedlist.skipNextPrev(1);
    })
    .filter(() => false);
  
  @Effect() skipBack$ = this.actions$
    .ofType(SHAREDLIST_ACTIONS.SKIP_BACK)
    .do((action) => {
      this.logger.debug(`SharedlistEffects.SKIP_BACK`);
      this.sharedlist.skipNextPrev(0);
    })
    .filter(() => false);
  
  @Effect() loopNext$ = this.actions$
    .ofType(SHAREDLIST_ACTIONS.LOOP_NEXT)
    .do((action) => {
      this.logger.debug(`SharedlistEffects.LOOP_NEXT`);
      this.sharedlist.skipNextPrev(1);
    })
    .filter(() => false);
}