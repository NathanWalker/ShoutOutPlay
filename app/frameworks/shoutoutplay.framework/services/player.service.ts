// angular
import {Injectable, Inject, forwardRef, OnInit} from 'angular2/core';

// nativescript
import {EventData} from 'data/observable';

// libs
import {Store, Reducer, Action} from '@ngrx/store';
import {Observable} from 'rxjs/Rx';
import {TNSSpotifyConstants, TNSSpotifyAuth, TNSSpotifyPlayer} from 'nativescript-spotify';

// app
import {Analytics, AnalyticsService} from '../../analytics.framework/index';
import {LogService, ProgressService} from '../../core.framework/index';
import {AUTH_ACTIONS, SearchStateI} from '../../shoutoutplay.framework/index';

// analytics
const CATEGORY: string = 'Player';

/**
 * ngrx setup start --
 */
export interface PlayerStateI {
  currentTrackId?: string;
  previewTrackId?: string;
  playing?: boolean;
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

export const playerReducer: Reducer<PlayerStateI> = (state: PlayerStateI = initialState, action: Action) => {
  let changeState = () => {
    return Object.assign({}, state, action.payload);
  };
  switch (action.type) {
    case PLAYER_ACTIONS.TOGGLE_PLAY:
      if ((action.payload.previewTrackId && action.payload.previewTrackId !== state.previewTrackId) ||
        (action.payload.currentTrackId && action.payload.currentTrackId !== state.currentTrackId)) {
        // when changing to new track, always start playing
        action.payload.playing = true

        // always reset the other (only 1 track can be played at a time, preview from search or playlist)
        if (action.payload.previewTrackId) action.payload.currentTrackId = undefined;
        if (action.payload.currentTrackId) action.payload.previewTrackId = undefined;
      } else {
        // toggle play 
        action.payload.playing = !state.playing;  
      }
      return changeState();
    case PLAYER_ACTIONS.STOP:
      // reset all
      action.payload = { playing: false, currentTrackId: undefined, previewTrackId: undefined };
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
  public state$: Observable<any>;
  private _spotify: TNSSpotifyPlayer;

  constructor(public analytics: AnalyticsService, private store: Store<any>, private logger: LogService, private loader: ProgressService) {
    super(analytics);
    this.category = CATEGORY;

    this.state$ = store.select('player');

    // init player
    loader.show();
    this._spotify = new TNSSpotifyPlayer();
    this._spotify.initPlayer(true);
    this.setupEvents();

    // react to search previews
    this.state$.subscribe((player: PlayerStateI) => {
      if (player.previewTrackId || player.currentTrackId) {
        // only if tracks are defined
        this.togglePlay(player.previewTrackId || player.currentTrackId, player.previewTrackId !== undefined);  
      } 
    });
  }

  private togglePlay(trackId: string, isPreview?: boolean) {
    this.loader.show();

    let trackUri: string = `spotify:track:${trackId}`;

    this._spotify.togglePlay(trackUri).then((isPlaying: boolean) => {
      this.loader.hide();
      this.track(PLAYER_ACTIONS.TOGGLE_PLAY, { label: `${trackUri} ${isPlaying ? 'playing' : 'paused'}` });
    }, (error) => {
      this.loader.hide();
      this.track(`[${CATEGORY}] ERROR`, { label: error.toString() });
      if (error === 'login') {
        this.updateLogin(false);
      }
    });
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
    // update playing state
    this.store.dispatch({ type: PLAYER_ACTIONS.STOP });
  }

  private setupEvents() {
    this._spotify.events.on('albumArtChange', (eventData: any) => {
      this.updateAlbumArt(eventData.data.url);
    });
    this._spotify.events.on('playerReady', (eventData: any) => {
      this.loader.hide();
    });
    this._spotify.events.on('stoppedPlayingTrack', (eventData: any) => {
      this.trackEnded(eventData.data.url);
    });
    this._spotify.auth.events.on('authLoginChange', (eventData: any) => {
      this.updateLogin(eventData.data.status);
    });
    this._spotify.auth.events.on('authLoginCheck', (eventData: any) => {
      this.loader.show();
    });
    this._spotify.auth.events.on('authLoginSuccess', (eventData: any) => {
      this.loginSuccess();
    });
    this._spotify.auth.events.on('authLoginError', (eventData: any) => {
      this.loginError(eventData.data);
    });
  } 
}