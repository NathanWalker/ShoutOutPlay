// angular
import {Injectable, Inject, forwardRef, OnInit, NgZone} from '@angular/core';

// nativescript
import {EventData} from 'data/observable';
import {TNSEZAudioPlayer} from 'nativescript-ezaudio';
import {File} from 'file-system';

// libs
import {Store, ActionReducer, Action} from '@ngrx/store';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/take';
import {TNSSpotifyConstants, TNSSpotifyAuth, TNSSpotifyPlayer} from 'nativescript-spotify';

// app
import {Analytics, AnalyticsService} from '../../analytics/index';
import {CoreConfigService, LogService, ProgressService, FancyAlertService, TextService} from '../../core/index';
import {AUTH_ACTIONS, SearchStateI, PLAYLIST_ACTIONS, COUCHBASE_ACTIONS} from '../../shoutoutplay/index';

declare var zonedCallback: Function;

// analytics
const CATEGORY: string = 'Player';

/**
 * ngrx setup start --
 */
export interface PlayerStateI {
  currentTrackId?: string;
  previewTrackId?: string;
  playing?: boolean;
  stopped?: boolean;
}

const initialState: PlayerStateI = {
  playing: false
};

interface PLAYER_ACTIONSI {
  TOGGLE_PLAY: string;
  STOP: string;
}

export const PLAYER_ACTIONS: PLAYER_ACTIONSI = {
  TOGGLE_PLAY: `[${CATEGORY}] TOGGLE_PLAY`,
  STOP: `[${CATEGORY}] STOP`
};

export const playerReducer: ActionReducer<PlayerStateI> = (state: PlayerStateI = initialState, action: Action) => {
  let changeState = () => {
    if (!action.payload) {
      action.payload = {}
    }
    if (!action.payload.stopped) {
      // always reset
      action.payload.stopped = false;
    }
    return Object.assign({}, state, action.payload);
  };
  switch (action.type) {
    case PLAYER_ACTIONS.TOGGLE_PLAY:
      // always reset the other (only 1 track can be played at a time, preview from search or playlist)
      if (action.payload.previewTrackId) action.payload.currentTrackId = undefined;
      if (action.payload.currentTrackId) action.payload.previewTrackId = undefined;
      return changeState();
    case PLAYER_ACTIONS.STOP:
      console.log(`PlayerReducer - PLAYER_ACTIONS.STOP`);
      let payload:any = { playing: false, stopped: true };
      if (action.payload && action.payload.reset) {
        // reset all
        payload.currentTrackId = undefined;
        payload.previewTrackId = undefined;
      }
      // reset all
      action.payload = payload;
      return changeState();
    default:
      return state;
  }
};
/**
 * ngrx end --
 */

@Injectable()
export class PlayerService extends Analytics {
  public static SHOUTOUT_START: number;
  public state$: Observable<any>;
  private _spotify: TNSSpotifyPlayer;
  private _shoutOutPlayer: TNSEZAudioPlayer;
  private _currentTrackId: string;
  private _currentShoutOutPath: string;
  private _shoutoutTimeout: any;

  constructor(public analytics: AnalyticsService, private store: Store<any>, private logger: LogService, private loader: ProgressService, private ngZone: NgZone, private fancyalert: FancyAlertService) {
    super(analytics);
    this.category = CATEGORY;

    this.state$ = store.select('player');

    PlayerService.SHOUTOUT_START = CoreConfigService.SHOUTOUT_START_TIME();

    // init player
    loader.show();
    this._spotify = new TNSSpotifyPlayer();
    this._spotify.initPlayer(true);
    this.setupEvents();

    this._shoutOutPlayer = new TNSEZAudioPlayer(true);
    this._shoutOutPlayer.delegate().audioEvents.on('reachedEnd', zonedCallback((eventData) => {
      this.logger.debug(`audioEvents.on('reachedEnd')`);
      this.toggleShoutOutPlay();
    }));

    // react to search previews
    this.state$.subscribe((player: PlayerStateI) => {
      if (player.previewTrackId || player.currentTrackId) {
        // only if tracks are defined
        this.togglePlay(player.previewTrackId || player.currentTrackId, player.previewTrackId !== undefined, player.playing);
      } else {
        // reset when tracks are cleared
        // normally used in conjunction with STOP (recording component clears them)
        this._currentShoutOutPath = undefined;
        // ensure playback is stopped
        this._spotify.togglePlay(null, false); // force stop playback
        this.store.dispatch({ type: COUCHBASE_ACTIONS.RESET_PLAYLISTS });
      }
    });
  }

  private togglePlay(trackId: string, isPreview?: boolean, playing?: boolean) {
    this.loader.show();

    let trackUri: string = `spotify:track:${trackId}`;

    if (!isPreview) {
      if (playing) {
        // when playing playlist tracks, queue shoutouts
        this.queueShoutOut(trackId);
      } else {
        // ensure queued shoutouts are turned off
        this.cancelShoutOutQueue();
      }
      this._currentTrackId = trackId;
    }
    
    this.logger.debug(`player.service togglePlay...`);
    this.logger.debug(trackId);
    this.logger.debug(`playing: ${playing}`);
    this._spotify.togglePlay(trackUri, playing).then((isPlaying: boolean) => {
      this.loader.hide();
      // this.track(PLAYER_ACTIONS.TOGGLE_PLAY, { label: `${trackUri} ${isPlaying ? 'playing' : 'paused'}` });
    }, (error) => {
      this.logger.debug(`togglePlay error:`);
      this.logger.debug(error);
      
      this.loader.hide();
      this.track(`[${CATEGORY}] ERROR`, { label: error.toString() });
      if (error === 'login') {
        this.updateLogin(false);
      }
    });
  }
  
  private queueShoutOut(trackId: string) {
    // always ensure spotify volume is up to start
    this.setSpotifyVolume(1);
    if (trackId !== this._currentTrackId) {
      this.store.take(1).subscribe((s: any) => {
        let playlists = [...s.couchbase.playlists];
        let shoutouts = [...s.couchbase.shoutouts];
        // find track and shoutout (if available)
        for (let playlist of playlists) {
          for (let track of playlist.tracks) {
            if (track.id === trackId) {
              if (track.shoutoutId) {
                for (let shoutout of shoutouts) {
                  if (shoutout.tmpId === track.shoutoutId) {
                    this._currentShoutOutPath = shoutout.recordingPath;
                    if (!File.exists(this._currentShoutOutPath)) {
                      // alert user
                      setTimeout(() => {
                        this.fancyalert.show(TextService.SHOUTOUT_NOT_FOUND);
                      }, 1000);
                    } else {
                      this._shoutoutTimeout = setTimeout(() => {
                        this.logger.debug(`queueShoutOut toggleShoutOutPlay(true)`);
                        this.toggleShoutOutPlay(true);
                      }, PlayerService.SHOUTOUT_START);     
                    }
                  }
                }
              }
              return;
            }
          }
        }
      });
    }
  }

  private toggleShoutOutPlay(reload?: boolean) {
    if (this._currentShoutOutPath && this._spotify.player) {
      this.logger.debug(`calling this.toggleShoutOutPlay();`);

      if (reload === true) {
        this.logger.debug(`_shoutOutPlayer.togglePlay`);
        this.logger.debug(this._currentShoutOutPath);
        this._shoutOutPlayer.togglePlay(this._currentShoutOutPath, true);
        // volume down spotify
        this.setSpotifyVolume(0.6);
      } else {
        // volume back up spotify
        this.setSpotifyVolume(1);
      }
    }
  }

  private cancelShoutOutQueue() {
    if (this._shoutOutPlayer.isPlaying()) {
      this._shoutOutPlayer.togglePlay(this._currentShoutOutPath);
    }
    if (this._shoutoutTimeout) {
      clearTimeout(this._shoutoutTimeout);
      this._shoutoutTimeout = undefined;
    }
    // always reset spotify playback volume
    this.setSpotifyVolume(1);
  }

  private setSpotifyVolume(volume: number) {
    if (this._spotify.player) {
      this._spotify.player.setVolumeCallback(volume, (error) => {
        if (error !== null) {
          console.log(`Spotify Player volume adjust error:`);
          console.log(error);
        }
      });
    }
  }

  private updateAlbumArt(url: string) {
    this.logger.debug(url);
  }

  private updateLogin(loggedIn: boolean) {
    this.store.dispatch({ type: AUTH_ACTIONS.LOGGED_IN_CHANGE, payload: { loggedIn } });
  }

  private loginSuccess() {
    this.logger.debug(`loginSuccess!`);
    this.updateLogin(true);
    this.loader.hide();
  }

  private loginError(error: any) {
    this.logger.debug(`loginError!`);
    this.logger.debug(error);
    this.updateLogin(false);
    this.loader.hide();
  }

  private trackEnded(url: string) {
    // play next track in playlist
    this.store.take(1).subscribe((s: any) => {
      let currentTrackId = s.player.currentTrackId;
      let trackEndedId = url.split(':')[2];
      if (currentTrackId === trackEndedId) {
        this.logger.debug(`*****     currentTrackId: ${currentTrackId}`);
        this.logger.debug(`*****     trackEndedId: ${trackEndedId}`);
        this.logger.debug(`*****     spotify.isPlaying(): ${(<any>this._spotify).isPlaying()}`);
        if (!(<any>this._spotify).isPlaying()) {
          // only if player has stopped
          // otherwise it's just triggered when user clicks to play another track
          this.store.dispatch({ type: PLAYLIST_ACTIONS.LOOP_NEXT });
        }
      }
    });
  }

  private setupEvents() {
    this._spotify.events.on('albumArtChange', (eventData: any) => {
      this.ngZone.run(() => {
        this.updateAlbumArt(eventData.data.url);
      });
    });
    this._spotify.events.on('playerReady', (eventData: any) => {
      this.ngZone.run(() => {
        this.loader.hide();
      });
    });
    this._spotify.events.on('stoppedPlayingTrack', (eventData: any) => {
      this.ngZone.run(() => {
        this.trackEnded(eventData.data.url);
      });
    });
    this._spotify.auth.events.on('authLoginChange', (eventData: any) => {
      this.ngZone.run(() => {
        this.updateLogin(eventData.data.status);
      });
    });
    this._spotify.auth.events.on('authLoginCheck', (eventData: any) => {
      this.ngZone.run(() => {
        this.loader.show();
      });
    });
    this._spotify.auth.events.on('authLoginSuccess', (eventData: any) => {
      this.ngZone.run(() => {
        this.loginSuccess();
      });
    });
    this._spotify.auth.events.on('authLoginError', (eventData: any) => {
      this.ngZone.run(() => {
        this.loginError(eventData.data);
      });
    });
  }
}