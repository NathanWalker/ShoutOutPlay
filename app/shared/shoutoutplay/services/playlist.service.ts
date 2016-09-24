// angular
import {Injectable, NgZone, forwardRef} from '@angular/core';
import {Router} from '@angular/router';

// nativescript
import {isIOS} from 'platform';
import * as dialogs from 'ui/dialogs';

declare var TNSFancyAlertButton;
if (isIOS) {
  var fAlerts = require('nativescript-fancyalert');
  TNSFancyAlertButton = fAlerts.TNSFancyAlertButton;
} else {
  // android
  TNSFancyAlertButton = (function () {
    function TNSFancyAlertButton(model) {
        if (model) {
            this.label = model.label;
            this.action = model.action;
        }
    }
    return TNSFancyAlertButton;
  }());
}

// libs
import {Store, ActionReducer, Action} from '@ngrx/store';
import {Effect, Actions} from '@ngrx/effects';
import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/observable/of';
import {TNSTrack, Utils} from 'nativescript-spotify';
import {isString, includes} from 'lodash';

// app
import {Analytics, AnalyticsService} from '../../analytics/index';
import {LogService, FancyAlertService, PROGRESS_ACTIONS} from '../../core/index';
import {PlaylistModel, TrackModel, PLAYER_ACTIONS, FIREBASE_ACTIONS, SHOUTOUT_ACTIONS} from '../index';

declare var zonedCallback: Function;

// analytics
const CATEGORY: string = 'Playlist';

/**
 * ngrx setup start --
 */
export interface IPlaylistState {
  playing?: boolean;
  showPicker?: boolean;
}

interface IPLAYLIST_ACTIONS {
  SHOW_PICKER: string;
  CLOSE_PICKER: string;
  LOOP_NEXT: string;
  NOOP: string;
  SKIP_NEXT: string;
  SKIP_BACK: string;
}

export const PLAYLIST_ACTIONS: IPLAYLIST_ACTIONS = {
  SHOW_PICKER: `${CATEGORY}_SHOW_PICKER`,
  CLOSE_PICKER: `${CATEGORY}_CLOSE_PICKER`,
  LOOP_NEXT: `${CATEGORY}_LOOP_NEXT`,
  NOOP: `${CATEGORY}_NOOP`,
  SKIP_NEXT: `${CATEGORY}_SKIP_NEXT`,
  SKIP_BACK: `${CATEGORY}_SKIP_BACK`
};

export const playlistReducer: ActionReducer<IPlaylistState> = (state: IPlaylistState = {}, action: Action) => {
  let changeState = () => {
    return Object.assign({}, state, action.payload);
  };
  switch (action.type) {
    case PLAYLIST_ACTIONS.SHOW_PICKER:
      action.payload = { showPicker: true };
      return changeState();
    case PLAYLIST_ACTIONS.CLOSE_PICKER:
      action.payload = { showPicker: false };
      return changeState();
    default:
      return state;
  }
};
/**
 * ngrx end --
 */

@Injectable()
export class PlaylistService extends Analytics {
  public state$: Observable<any>;
  public showRecord$: BehaviorSubject<any> = new BehaviorSubject(null);
  private selectedTrack: TrackModel;

  constructor(public analytics: AnalyticsService, private store: Store<any>, private logger: LogService, private ngZone: NgZone, private fancyalert: FancyAlertService) {
    super(analytics);
    this.category = CATEGORY;

    this.state$ = store.select('playlist');
  }

  public togglePlay(playlistId: string, track?: any) {
    this.store.take(1).subscribe((s: any) => {
      this.logger.debug('PlaylistService.togglePlay: this.store.take(1).subscribe, should update playlist state');
      let playlists = [...s.firebase.playlists];
      let sharedlist = [...s.firebase.sharedlist];
      let currentTrackId = s.player.currentTrackId;
      let playing = !s.player.playing; // new playing state is always assumed the opposite unless the following...
      if (track) {
        if (track.id !== currentTrackId) {
          // changing track, always play new track
          playing = true;
        }
        // IMP: must come after above
        // always ensure currentTrackId is set to incoming track
        currentTrackId = track.id;
      } 
      this.logger.debug(`playlistId: ${playlistId}`);
      
      // find playlist
      let playlistIndex = -1;
      for (let i = 0; i < playlists.length; i++) {
        if (playlistId) {
          if (playlistId === playlists[i].id) {
            playlistIndex = i;
            break;
          }
        } else if (track) {
          // find from playlist
          // TODO: Potential error here if the same track exists on 2 of more different playlists
          for (let t of playlists[i].tracks) {
            if (t.id === track.id) {
              playlistId = playlists[i].id;
              playlistIndex = i;
              break;
            }
          }
        }
        
      }
      this.logger.debug(`playlistIndex: ${playlistIndex}`);
      // determine playlist state first
      if (playlistIndex > -1) {
        if (playlists[playlistIndex].tracks.length === 0) {
          // dialogs.alert(`Playlist is empty! Add some tracks to play.`);
          this.fancyalert.show(`Playlist is empty! Add some tracks to play.`);
          return;
        } else {
          // update current playlist state
          let playFirst = true;
          for (let t of playlists[playlistIndex].tracks) {
            if (track) {
              // when track is used, playlist state is determined by the track
              playFirst = false;
              // explicit track
              if (track.id === t.id) {
                t.playing = playing; 
                playlists[playlistIndex].playing = playing;
                this.logger.debug(`setting track playing: ${t.playing}`);
              } else {
                // reset all others to off
                t.playing = false;
              }
            } else {
              // no track specified (play from playlist view)
              // find if any are currently playing
              if (t.playing) {
                currentTrackId = t.id;
                // toggle off
                playing = false;
                t.playing = playing;
                playlists[playlistIndex].playing = playing;
                playFirst = false;
              }
            }
          }

          if (playFirst) {
            if (playlists[playlistIndex].tracks[0].id !== currentTrackId) {
              // changing track, always play new track
              playing = true;
            }
            playlists[playlistIndex].tracks[0].playing = playing;
            playlists[playlistIndex].playing = playing;
            currentTrackId = playlists[playlistIndex].tracks[0].id;
          }

          // always reset others to be clean
          for (let p of playlists) {
            if (p.id !== playlistId) {
              p.playing = false;
              for (let t of p.tracks) {
                t.playing = false;
              }
            }
          }
        }
        this.logger.debug(`playlists[playlistIndex].playing: ${playlists[playlistIndex].playing}`);
        // TODO: refactor - keep sharedlist state in sync here
        for (let t of sharedlist) {
          if (t.trackId == currentTrackId) {
            t.playing = playing;
          }
        }
      
        this.ngZone.run(() => {
          this.store.dispatch({ type: PLAYER_ACTIONS.TOGGLE_PLAY, payload: { currentTrackId, playing } });
          this.store.dispatch({ type: FIREBASE_ACTIONS.UPDATE, payload: { playlists, sharedlist } });
        });
      }  
    });
  }

  public addPrompt(track: TrackModel) {
    this.logger.debug('show prompt!');
    this.selectedTrack = track;
    this.getRawPlaylists().then((playlists: Array<PlaylistModel>) => {
      let promptNew = () => {
        this.fancyalert.prompt('Name', '', 'Add to New Playlist...', 'plus', (value: any) => {
          this.create(value, this.selectedTrack);
        });
      };
      
      if (playlists.length === 0) {
        // create playlist
        promptNew();
      } else {

        this.logger.debug('fancyalert.action');        
        this.fancyalert.action('Add track to...', null, 'question', [
          new TNSFancyAlertButton({
            label: 'Existing Playlist',
            action: () => {
              this.store.dispatch({ type: PLAYLIST_ACTIONS.SHOW_PICKER });
            }
          }),
          new TNSFancyAlertButton({
            label: 'New Playlist',
            action: () => {
              promptNew();
            }
          })
        ]);  
      }
    });
  } 

  public addTrackTo(playlistId: string) {
    this.store.take(1).subscribe((s: any) => {
      let playlists = [...s.firebase.playlists];
      for (let item of playlists) {
        if (item.id === playlistId) {
          if (item.addTrack(this.selectedTrack)) {
            this.store.dispatch({ type: FIREBASE_ACTIONS.PROCESS_UPDATES, payload: item });
            this.store.dispatch({ type: PROGRESS_ACTIONS.SUCCESS, payload: 'Added!' });
            this.selectedTrack.playlistId = playlistId;
            this.promptToRecord(this.selectedTrack);
            break;
          } else {
            this.fancyalert.show(`Track was already added to that playlist.`);
            break;
          }
        }
      }  
    });
  }

  public edit(playlist: PlaylistModel): Promise<PlaylistModel> {
    return new Promise((resolve) => {
      this.fancyalert.prompt(playlist.name, playlist.name, 'Edit', 'edit', (value: any) => {
        playlist.name = value;
        this.store.dispatch({ type: FIREBASE_ACTIONS.PROCESS_UPDATES, payload: playlist });
        resolve(playlist);
      });
    });
  }

  public clearTrackShoutouts(playlist: PlaylistModel) {
    if (playlist.tracks.length) {
      let shoutoutIds = playlist.tracks.filter(track => isString(track.shoutoutId)).map(t => t.shoutoutId);
      if (shoutoutIds.length) {
        this.store.take(1).subscribe((s: any) => {
          let filenames = s.firebase.shoutouts.filter(s => includes(shoutoutIds, s.id)).map(s => s.filename);
          this.store.dispatch({type: SHOUTOUT_ACTIONS.REMOVE_LOCAL, payload: {filenames, removeRemote: true}});
        });
      }
    }
  }

  public skipNextPrev(direction: number) {
    let playlists = [];
    let playlistIndex = -1;
    let trackIndex = -1;
    let playlistId;
    let track;

    this.store.take(1).subscribe((s: any) => {
      let currentTrackId = s.player.currentTrackId;
      if (currentTrackId) {
        playlists = [...s.firebase.playlists];
        for (let i = 0; i < playlists.length; i++) {
          for (let a = 0; a < playlists[i].tracks.length; a++) {
            if (playlists[i].tracks[a].id === currentTrackId) {
              playlistId = playlists[i].id;
              track = playlists[i].tracks[a];
              playlistIndex = i;
              trackIndex = a;
              this.logger.debug(`skipNextPrev, found indices, playlistIndex: ${playlistIndex}, trackIndex: ${trackIndex}`);
              break;
            }
          }
        }

        if (playlists.length && playlistIndex > -1 && trackIndex > -1) {
          if (direction) {
            // next track
            trackIndex++;       
          } else {
            // prev track
            trackIndex--;
          }

          let trackId;
          if (trackIndex > -1 && trackIndex < playlists[playlistIndex].tracks.length) {
            trackId = playlists[playlistIndex].tracks[trackIndex].id;
            track = playlists[playlistIndex].tracks[trackIndex];
          } else {
            // start over from start
            trackId = playlists[playlistIndex].tracks[0].id;
            track = playlists[playlistIndex].tracks[0];
          }
          this.togglePlay(playlistId, track);
        }
      }
    });
    
  }

  private promptToRecord(track: TrackModel) {
    setTimeout(() => {
      this.fancyalert.action('Record a ShoutOut?', null, 'microphone', [
        new TNSFancyAlertButton({
          label: 'Yes!',
          action: () => {
            // This funkiness is because `Router` cannot be injected directly!
            // due to some cyclic dependency issue with ngrx/effects :(
            this.showRecord$.next(track);
            setTimeout(() => {
              // reset value back
              this.showRecord$.next(null);
            });
          }
        })
      ]);
    }, 1000);  
  }

  private create(name: string, track: TrackModel) {
    this.store.dispatch({ type: PROGRESS_ACTIONS.SHOW });
    this.logger.debug(`Creating playlist named '${name}', and adding track: ${track.name}`);
    this.getRawPlaylists().then((playlists: Array<PlaylistModel>) => {
      let newPlaylist = new PlaylistModel({ name });
      newPlaylist.order = playlists.length;
      // TODO: do NOT addTrack here, instead, only dispatch CREATE then wait to get playlist id back
      // to properly set playlistId on track
      newPlaylist.addTrack(track);
      this.store.dispatch({ type: FIREBASE_ACTIONS.CREATE, payload: newPlaylist });

      setTimeout(() => {       
        for (let p of playlists) {
          for (let t of p.tracks) {
            if (t.id === track.id) {
              track.playlistId = p.id;
              break;
            }
          }
        }
        this.promptToRecord(track);      
      }, 1500);
    });
  }

  private getRawPlaylists(): Promise<any> {
    return new Promise((resolve: any) => {
      this.store.take(1).subscribe((s: any) => {
        resolve([...s.firebase.playlists]);
      });
    })
  }
}

@Injectable()
export class PlaylistEffects {
  constructor(private store: Store<any>, private logger: LogService, private actions$: Actions, private playlistService: PlaylistService) { }
  
  @Effect() deletedPlayist$ = this.actions$
    .ofType(FIREBASE_ACTIONS.PLAYLIST_DELETED)
    .do((action) => {
      this.logger.debug(`PlaylistEffects.PLAYLIST_DELETED`);
      this.playlistService.clearTrackShoutouts(action.payload);
    })
    .filter(() => false);
  
  @Effect() skipNext$ = this.actions$
    .ofType(PLAYLIST_ACTIONS.SKIP_NEXT)
    .do((action) => {
      this.logger.debug(`PlaylistEffects.SKIP_NEXT`);
      this.playlistService.skipNextPrev(1);
    })
    .filter(() => false);
  
  @Effect() skipBack$ = this.actions$
    .ofType(PLAYLIST_ACTIONS.SKIP_BACK)
    .do((action) => {
      this.logger.debug(`PlaylistEffects.SKIP_BACK`);
      this.playlistService.skipNextPrev(0);
    })
    .filter(() => false);
  
  @Effect() loopNext$ = this.actions$
    .ofType(PLAYLIST_ACTIONS.LOOP_NEXT)
    .do((action) => {
      this.logger.debug(`PlaylistEffects.LOOP_NEXT`);
      this.playlistService.skipNextPrev(1);
    })
    .filter(() => false);
}