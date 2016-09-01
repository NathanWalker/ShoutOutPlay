// angular
import {Injectable, Inject, forwardRef, OnInit, NgZone} from '@angular/core';

// nativescript
import {EventData} from 'data/observable';
import {isIOS} from 'platform';
import {TNSPlayer} from 'nativescript-audio';
import {File} from 'file-system';

var TNSEZAudioPlayer;
if (isIOS) {
  let ezAudio = require('nativescript-ezaudio');
  TNSEZAudioPlayer = ezAudio.TNSEZAudioPlayer;
}

// libs
import {Store, ActionReducer, Action} from '@ngrx/store';
import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/take';
import {TNSSpotifyConstants, TNSSpotifyAuth, TNSSpotifyPlayer} from 'nativescript-spotify';

// app
import {Analytics, AnalyticsService} from '../../analytics/index';
import {Config, LogService, ProgressService, FancyAlertService, TextService, Utils} from '../../core/index';
import {AUTH_ACTIONS, ISearchState, PLAYLIST_ACTIONS, FIREBASE_ACTIONS} from '../../shoutoutplay/index';
import {CommandCenterHandler} from './command-center';

declare var zonedCallback: Function, MPNowPlayingInfoCenter, interop;

// analytics
const CATEGORY: string = 'Player';

/**
 * ngrx setup start --
 */
export interface IPlayerState {
  currentTrackId?: string;
  previewTrackId?: string;
  playing?: boolean;
  stopped?: boolean;
}

const initialState: IPlayerState = {
  playing: false
};

interface IPLAYER_ACTIONS {
  TOGGLE_PLAY: string;
  STOP: string;
}

export const PLAYER_ACTIONS: IPLAYER_ACTIONS = {
  TOGGLE_PLAY: `[${CATEGORY}] TOGGLE_PLAY`,
  STOP: `[${CATEGORY}] STOP`
};

export const playerReducer: ActionReducer<IPlayerState> = (state: IPlayerState = initialState, action: Action) => {
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
  public static currentTrackId: string;
  public static isPreview: boolean;
  public static isPlaying: boolean;

  public state$: Observable<any>;
  public currentTrack$: BehaviorSubject<any> = new BehaviorSubject(null);
  public albumArtUrl$: BehaviorSubject<string> = new BehaviorSubject(null);
  private _spotify: TNSSpotifyPlayer;
  private _shoutOutPlayer: any;
  private _shoutOutPlayerOptions: any;
  private _currentTrackId: string;
  private _currentShoutOutPath: string;
  private _shoutoutTimeout: any;
  private _nowPlayingInfo: any;
  private _playConnectingTimeout: any;
  private _cmdCenterHandler: any;
  private _currentTrack: any;

  constructor(public analytics: AnalyticsService, private store: Store<any>, private logger: LogService, private loader: ProgressService, private ngZone: NgZone, private fancyalert: FancyAlertService) {
    super(analytics);
    this.category = CATEGORY;

    this.state$ = store.select('player');

    PlayerService.SHOUTOUT_START = Config.SHOUTOUT_START_TIME();

    // init player
    this._spotify = new TNSSpotifyPlayer();
    this._spotify.initPlayer(true);
    this.setupEvents();

    if (isIOS) {
      this._shoutOutPlayer = new TNSEZAudioPlayer(true);
      this._shoutOutPlayer.delegate().audioEvents.on('reachedEnd', zonedCallback((eventData) => {
        this.logger.debug(`audioEvents.on('reachedEnd')`);
        this.toggleShoutOutPlay();
      }));
    } else {
      this._shoutOutPlayer = new TNSPlayer();
      this._shoutOutPlayerOptions = {
        completeCallback: () => {
          this.logger.debug(`_shoutOutPlayer completeCallback`);
          this.toggleShoutOutPlay();

          // this._shoutOutPlayer.dispose().then(() => {
          //   this.logger.debug('DISPOSED');
          // }, (err) => {
          //   this.logger.debug('ERROR disposePlayer: ' + err);
          // });
        },
        errorCallback: (err) => {
          this.logger.debug(err);
        },
        infoCallback: (info) => {
          this.logger.debug('Info callback: ' + info.msg);
          this.logger.debug("what: " + info);
        }
      };
    }

    this.state$.subscribe((player: IPlayerState) => {
      if (player.previewTrackId || player.currentTrackId) {
        // only if tracks are defined
        this.togglePlay(player.previewTrackId || player.currentTrackId, player.previewTrackId !== undefined, player.playing);
      } else {
        // reset when tracks are cleared
        // normally used in conjunction with STOP (recording component clears them)
        this._currentShoutOutPath = undefined;
        PlayerService.isPlaying = false;
        // ensure playback is stopped
        if (this._spotify) {
          this._spotify.togglePlay(null, false); // force stop playback
          this.store.dispatch({ type: FIREBASE_ACTIONS.RESET_PLAYLISTS });
        }      
      }
    });

    if (isIOS) {
      this.initCommandCenter();
    }    
  }

  public togglePlay(trackId: string, isPreview?: boolean, playing?: boolean) {
    if (playing) {
      this.loader.show();
      this.resetConnectionTimeout();
      // helps prevent infinte spins in case of non-responsive Spotify service
      this._playConnectingTimeout = setTimeout(() => {
        if (!this._spotify.isPlaying()) {
          // still not playing, alert user there could be an issue
          this.fancyalert.show(TextService.SPOTIFY_PLAY_DELAY_NOTICE);
          this.playerUIStateReset();
        } 
      }, 5500);
    } else {
      this.resetConnectionTimeout();
    }

    let trackUri: string = `spotify:track:${trackId}`;
    PlayerService.currentTrackId = trackId;
    PlayerService.isPreview = isPreview;
    PlayerService.isPlaying = playing;

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

    // ensure spotify volume is up to normal
    this.setSpotifyVolume(1);
    
    this.logger.debug(`player.service togglePlay...`);
    this.logger.debug(trackId);
    this.logger.debug(`playing: ${playing}`);
    this._spotify.togglePlay(trackUri, playing).then((isPlaying: boolean) => {
      this.playerUIStateReset();
    }, (error) => {
      this.logger.debug(`togglePlay error:`);
      this.logger.debug(error);
      
      this.playerUIStateReset();
      this.track(`[${CATEGORY}] ERROR`, { label: error.toString() });
      if (error === 'login') {
        this.updateLogin(false);
      }
    });
  }

  public cmdTogglePlay(playing?: boolean) {
    this.logger.debug(`this.cmdTogglePlay:`);
    this.logger.debug(playing);
    // if (typeof playing === 'undefined') playing = !this._spotify.isPlaying();
    if (typeof playing === 'undefined') playing = !PlayerService.isPlaying;
    this.logger.debug(`playing: ${playing}`);
    this.ngZone.run(() => {
      this.store.dispatch({ type: PLAYER_ACTIONS.TOGGLE_PLAY, payload: { currentTrackId: PlayerService.currentTrackId, playing: playing } });
    });
  }

  public cmdPrevNext(direction: number) {
    this.ngZone.run(() => {
      if (direction) {
        if (PlayerService.isPreview) {
          // ignore
          // TODO: could advance to next search result track
        } else {
          this.store.dispatch({ type: PLAYLIST_ACTIONS.SKIP_NEXT });
        }
      } else {
        if (PlayerService.isPreview) {
          // seek to beginning of track
          if (isIOS) {
            this._spotify.player.seekToOffsetCallback(0, (error: any) => {
              this.logger.debug('seeked to 0.');
            });
          } else {
            // TODO: android seek
          }
        } else {
          this.store.dispatch({ type: PLAYLIST_ACTIONS.SKIP_BACK });
        }
      }
    });
  }
  
  public cmdSeek(args: any) {
    this.ngZone.run(() => {
      this.logger.debug(`cmdSeek...`);
      this.logger.debug(args);
      // let offset = 
      // this._spotify.player.seekToOffsetCallback(offset, (error: any) => {
      //   if (error != null) {
      //     this.logger.debug(`Spotify seek error:`);
      //     this.logger.debug(error);
      //   }
      // });
    });
  }

  private resetConnectionTimeout() {
    if (this._playConnectingTimeout) {
      clearTimeout(this._playConnectingTimeout);
      this._playConnectingTimeout = undefined;
    }
  }

  private playerUIStateReset() {
    this.loader.hide();
    this.resetConnectionTimeout();
  }
  
  private queueShoutOut(trackId: string) {
    // always ensure spotify volume is up to start
    this.setSpotifyVolume(1);
    if (trackId !== this._currentTrackId) {
      this.store.take(1).subscribe((s: any) => {
        let playlists = [...s.firebase.playlists];
        let shoutouts = [...s.firebase.shoutouts];
        // find track and shoutout (if available)
        for (let playlist of playlists) {
          for (let track of playlist.tracks) {
            if (track.id === trackId) {
              if (track.shoutoutId) {
                for (let shoutout of shoutouts) {
                  if (shoutout.id === track.shoutoutId) {
                    this._currentShoutOutPath = Utils.documentsPath(shoutout.filename);
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

        if (isIOS) {
          this._shoutOutPlayer.togglePlay(this._currentShoutOutPath, true);
        } else {
          if (this._shoutOutPlayer.isAudioPlaying()) {
            this._shoutOutPlayer.pause();
          } else {
            this._shoutOutPlayerOptions.audioFile = this._currentShoutOutPath;
            this._shoutOutPlayer.playFromFile(this._shoutOutPlayerOptions);
          }
        }
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
      if (isIOS) {
        this._spotify.player.setVolumeCallback(volume, (error) => {
          if (error !== null) {
            console.log(`Spotify Player volume adjust error:`);
            console.log(error);
          }
        });
      } else {
        // TODO: android volume 
        // https://github.com/spotify/android-sdk/issues/208
      }
    }
  }

  private updateAlbumArt(url: string) {
    this.logger.debug(url);
    this.albumArtUrl$.next(url);

    if (isIOS) {

      let nsUrl = NSURL.URLWithString(url);
      let data = NSData.dataWithContentsOfURL(nsUrl);
      if (!data) {
        this.logger.debug(`Failed to load data from URL: ${url}`);
        return;
      }

      let image = UIImage.imageWithData(data);
      // this.logger.debug(`album image:`);
      // this.logger.debug(image);
    	let artwork = MPMediaItemArtwork.alloc().initWithImage(image);
      // this.logger.debug(`MPMediaItemArtwork:`);
      // this.logger.debug(artwork);
      this.updateiOSControlCenter(artwork);
    }
  }

  private updateiOSControlCenter(artwork?: any) {
    // let metadata: any = this._spotify.currentTrackMetadata();
    // this.logger.keys(metadata, true);
    
    if (this._currentTrack) {
      if (!this._nowPlayingInfo) {
        this._nowPlayingInfo = new NSMutableDictionary();
      }
      this._nowPlayingInfo.setValueForKey(NSString.stringWithString(this._currentTrack.trackName), MPMediaItemPropertyTitle);
      this._nowPlayingInfo.setValueForKey(NSString.stringWithString(this._currentTrack.albumName), MPMediaItemPropertyAlbumTitle);
      this._nowPlayingInfo.setValueForKey(NSString.stringWithString(this._currentTrack.artistName), MPMediaItemPropertyArtist);
      this._nowPlayingInfo.setValueForKey(NSNumber.numberWithFloat(this._currentTrack.trackDuration * .001), MPMediaItemPropertyPlaybackDuration);
      this._nowPlayingInfo.setValueForKey(NSNumber.numberWithDouble(1.0), MPNowPlayingInfoPropertyPlaybackRate); 

      if (artwork) {
        this._nowPlayingInfo.setValueForKey(artwork, MPMediaItemPropertyArtwork);
      }

      // this.logger.debug(`setting MPNowPlayingInfoCenter.defaultCenter().nowPlayingInfo`);
      MPNowPlayingInfoCenter.defaultCenter().nowPlayingInfo = this._nowPlayingInfo;
    }
  }

  private initCommandCenter() {
    let errorRef = new interop.Reference();
    (<any>AVAudioSession.sharedInstance()).setCategoryError(AVAudioSessionCategoryPlayback, errorRef);
    if (errorRef) {
      console.log(`setCategoryError: ${errorRef.value}`);
    }
    (<any>AVAudioSession.sharedInstance()).setActiveError(true, errorRef);  
    if (errorRef) {
      console.log(`setActiveError: ${errorRef.value}`);
    }
    this._cmdCenterHandler = (<any>CommandCenterHandler).initWithOwner(new WeakRef(<any>this));
    MPRemoteCommandCenter.sharedCommandCenter().pauseCommand.addTargetAction(this._cmdCenterHandler, 'cmdPause');
    MPRemoteCommandCenter.sharedCommandCenter().playCommand.addTargetAction(this._cmdCenterHandler, 'cmdPlay');
    MPRemoteCommandCenter.sharedCommandCenter().stopCommand.addTargetAction(this._cmdCenterHandler, 'cmdStop');
    MPRemoteCommandCenter.sharedCommandCenter().togglePlayPauseCommand.addTargetAction(this._cmdCenterHandler, 'cmdTogglePlay');
    MPRemoteCommandCenter.sharedCommandCenter().nextTrackCommand.addTargetAction(this._cmdCenterHandler, 'cmdNext');
    MPRemoteCommandCenter.sharedCommandCenter().previousTrackCommand.addTargetAction(this._cmdCenterHandler, 'cmdPrev');
    MPRemoteCommandCenter.sharedCommandCenter().seekForwardCommand.addTargetAction(this._cmdCenterHandler, 'cmdSeekFwd');
    MPRemoteCommandCenter.sharedCommandCenter().seekBackwardCommand.addTargetAction(this._cmdCenterHandler, 'cmdSeekBack');

    // [commandCenter.enableLanguageOptionCommand addTarget:self action:@selector(onEnableLanguageOption:)];
    // [commandCenter.disableLanguageOptionCommand addTarget:self action:@selector(onDisableLanguageOption:)];

    // if ([cmd isEqual: @"@pause"]) {
    //   remoteCenter.pauseCommand.enabled = enabled;
    // } else if ([cmd isEqual: @"play"]) {
    //   remoteCenter.playCommand.enabled = enabled;
    // } else if ([cmd isEqual: @"stop"]) {
    //   remoteCenter.stopCommand.enabled = enabled;
    // } else if ([cmd isEqual: @"togglePlayPause"]) {
    //   remoteCenter.togglePlayPauseCommand.enabled = enabled;
    // } else if ([cmd isEqual: @"enableLanguageOption"]) {
    //   remoteCenter.enableLanguageOptionCommand.enabled = enabled;
    // } else if ([cmd isEqual: @"disableLanguageOption"]) {
    //   remoteCenter.disableLanguageOptionCommand.enabled = enabled;
    // } else if ([cmd isEqual: @"nextTrack"]) {
    //   remoteCenter.nextTrackCommand.enabled = enabled;
    // } else if ([cmd isEqual: @"previousTrack"]) {
    //   remoteCenter.previousTrackCommand.enabled = enabled;
    // } else if ([cmd isEqual: @"seekForward"]) {
    //   remoteCenter.seekForwardCommand.enabled = enabled;
    // } else if ([cmd isEqual: @"seekBackward"]) {
    //   remoteCenter.seekBackwardCommand.enabled = enabled;
    // }
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
        this.logger.debug(`*****     spotify.isPlaying(): ${this._spotify.isPlaying()}`);
        if (!this._spotify.isPlaying()) {
          // only if player has stopped
          // otherwise it's just triggered when user clicks to play another track
          this.store.dispatch({ type: PLAYLIST_ACTIONS.LOOP_NEXT });
        }
      }
    });
  }

  private tmpConnectionError() {
    this.logger.debug('Temporary connection error.');
    this.playerUIStateReset();
  }

  private streamError(error: any) {
    this.logger.debug('Stream error:');
    this.logger.debug(error);
    if (error) {
      if (error.toString().indexOf('requires a Spotify Premium') > -1) {
        // log user out, warn not Premium
        this.fancyalert.show(TextService.SPOTIFY_PREMIUM_MSG);
        TNSSpotifyAuth.CLEAR_COOKIES = true;
        TNSSpotifyAuth.LOGOUT();
      }
    }
    this.playerUIStateReset();
  }

  private receivedMessage(message: string) {
    this.logger.debug('Spotify service message:');
    this.logger.debug(message);
  }

  private streamDisconnected() {
    this.logger.debug('Stream has disconnected.');
    PlayerService.isPlaying = false;
    this.playerUIStateReset();
    this.fancyalert.show(TextService.STREAM_DISCONNECT);
  }

  private updatePlayerState(state: any) {
    if (state && state.currentTrack) {
      if (!this._currentTrack || (this._currentTrack && this._currentTrack.uri !== state.currentTrack.uri)) {
        this._currentTrack = {
          uri: state.currentTrack.uri.trim(),
          trackName: state.currentTrack.name.trim(),
          albumName: state.currentTrack.albumName.trim(),
          artistName: state.currentTrack.artistName.trim(),
          trackDuration: state.currentTrack.durationMs
        };
        this.currentTrack$.next(this._currentTrack);
      }

      this.logger.debug(`----------`);
      let totalDurationSeconds = state.currentTrack.durationMs * .001;
      let currentPlayback = 0;
      if (isIOS) {

        // iOS sdk beta.20 no longer has explicity track end (wtf)
        currentPlayback = this._spotify.player.currentPlaybackPosition;

        this.logger.debug(`player state change, totalDurationSeconds: ${totalDurationSeconds}`);
        this.logger.debug(`player state change, currentPlaybackPosition: ${currentPlayback}`);
        this.logger.debug(`player state change, track.uri: ${state.currentTrack.uri}`);
        
        // consider track ending if this fires and currentPlaybackPosition is within 1.2 seconds of total durationMs
        // spotify changed their api with beta.20 and no longer have official stopped track delegate method :(
        let diff = totalDurationSeconds - currentPlayback;
        if (diff < 2.5 && diff > 0) {
          this.trackEnded(state.currentTrack.uri);
        }
      } else {
        currentPlayback = state.currentTrack.positionInMs * .001;

        // android has explicity track end        
        if (state.currentTrack.eventType === 'TRACK_END') {
          this.trackEnded(state.currentTrack.uri.trim());
        }
      }
    }
  }

  private setupEvents() {
    this._spotify.events.on('albumArtChange', (eventData: any) => {
      this.ngZone.run(() => {
        this.updateAlbumArt(eventData.data.url);
      });
    });
    this._spotify.events.on('changedPlaybackState', (eventData: any) => {
      this.ngZone.run(() => {
        this.updatePlayerState(eventData.data.state);
      });
    });
    this._spotify.events.on('playerReady', (eventData: any) => {
      this.ngZone.run(() => {
        this.loader.hide();
      });
    });
    // this._spotify.events.on('stoppedPlayingTrack', (eventData: any) => {
    //   this.ngZone.run(() => {
    //     this.trackEnded(eventData.data.url);
    //   });
    // });
    this._spotify.events.on('temporaryConnectionError', (eventData: any) => {
      this.ngZone.run(() => {
        this.tmpConnectionError();
      });
    });
    this._spotify.events.on('streamError', (eventData: any) => {
      this.ngZone.run(() => {
        this.streamError(eventData.data.error);
      });
    });
    this._spotify.events.on('receivedMessage', (eventData: any) => {
      this.ngZone.run(() => {
        this.receivedMessage(eventData.data.message);
      });
    });
    this._spotify.events.on('streamDisconnected', (eventData: any) => {
      this.ngZone.run(() => {
        this.streamDisconnected();
      });
    });

    // Auth Events
    this._spotify.auth.events.on('authLoginChange', (eventData: any) => {
      this.ngZone.run(() => {
        this.updateLogin(eventData.data.status);
      });
    });
    // DANGER: This was causing infinite spins sometimes when trying to login with redirect back into app
    // may want to implement later doing something else, but showing loader here is bad idea
    // this._spotify.auth.events.on('authLoginCheck', (eventData: any) => {
    //   this.ngZone.run(() => {
    //     this.loader.show();
    //   });
    // });
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

