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
  currentTrack?: string;
  previewTrack?: string;
  playing?: boolean;
}

const initialState: PlayerStateI = {
  playing: false
};

interface PLAYER_ACTIONSI {
  TOGGLE_PLAY: string;
  PLAY: string;
  PAUSE: string;
  TRACK_CHANGE: string;
  PREVIEW_CHANGE: string;
}

export const PLAYER_ACTIONS: PLAYER_ACTIONSI = {
  TOGGLE_PLAY: `[${CATEGORY}] TOGGLE_PLAY`,
  PLAY: `[${CATEGORY}] PLAY`,
  PAUSE: `[${CATEGORY}] PAUSE`,
  TRACK_CHANGE: `[${CATEGORY}] TRACK_CHANGE`,
  PREVIEW_CHANGE: `[${CATEGORY}] PREVIEW_CHANGE`
};

export const playerReducer: Reducer<PlayerStateI> = (state: PlayerStateI = initialState, action: Action) => {
  let changeState = () => {
    return Object.assign({}, state, action.payload);
  };
  switch (action.type) {
    case PLAYER_ACTIONS.TOGGLE_PLAY:
      return changeState();
    case PLAYER_ACTIONS.PLAY:
      return changeState();
    case PLAYER_ACTIONS.PAUSE:
      return changeState();
    case PLAYER_ACTIONS.TRACK_CHANGE:
      return changeState();
    case PLAYER_ACTIONS.PREVIEW_CHANGE:
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

  // helper state (not for app state usage)
  private _currentPreview: string;
  private _currentTrack: string;
  private _playing: boolean;

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
    store.select('search').subscribe((search: SearchStateI) => {
      let currentPreviewId: string;
      if (this._currentPreview) {
        currentPreviewId = this._currentPreview.split(':')[2];
      }
      if (search && search.previewTrackId && (search.previewTrackId !== currentPreviewId || search.playing !== this._playing)) {
        // only togglePlay when previewTrackId is defined, is different than current OR playing state changes
        this.togglePlay(search.previewTrackId, true);
      }
    });
  }

  public togglePlay(trackId: string, isPreview?: boolean) {
    this.loader.show();

    let trackUri: string = `spotify:track:${trackId}`;

    this._spotify.togglePlay(trackUri).then((isPlaying: boolean) => {
      this.stateHandler(trackUri, isPreview, isPlaying);
    }, (error) => {
      this.stateHandler(trackUri, isPreview, false);
      if (error === 'login') {
        this.updateLogin(false);
      }
    });
  }

  private stateHandler(track: string, isPreview: boolean, playing: boolean) {
    this.loader.hide();
    this._playing = playing;
    
    let type: string;
    let payload: any = {
      playing: playing
    };
    if (isPreview) {
      payload.previewTrack = track;
      if (this._currentPreview !== track) {
        // don't actually change unless diff
        type = PLAYER_ACTIONS.PREVIEW_CHANGE;
        this._currentTrack = undefined;
        this._currentPreview = track;
      }          
    } else {
      payload.currentTrack = track;
      if (this._currentTrack !== track) {
        // don't actually change unless diff
        type = PLAYER_ACTIONS.TRACK_CHANGE;
        this._currentPreview = undefined;
        this._currentTrack = track;
      }
    }
    if (type) {
      // track change - analytics
      this.track(type, { label: track });
    } else {
      // just toggling playback
      type = PLAYER_ACTIONS[playing ? 'PLAY' : 'PAUSE'];
    }
    this.store.dispatch({ type: type, payload: payload });  
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
    console.log(`TODO: correct state in results list`);
    // update play/pause state in list
    // TODO: not as simple as below... need another state to just update search results state
    // the following depends on togglePlay which in this case player.isPlaying is false, so calling again just plays it again
    // let isPreview = this._currentPreview !== undefined;
    // this.stateHandler(url, isPreview, false);
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