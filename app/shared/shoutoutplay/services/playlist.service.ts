// angular
import {Injectable, NgZone, forwardRef, Inject} from '@angular/core';
import {Router} from '@angular/router';

// nativescript
import * as dialogs from 'ui/dialogs';
import {TNSFancyAlertButton} from 'nativescript-fancyalert';

// libs
import {Store, ActionReducer, Action} from '@ngrx/store';
import {Effect, toPayload, StateUpdates} from '@ngrx/effects';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/observable/of';
import {TNSTrack, Utils} from 'nativescript-spotify';
import {isString, includes} from 'lodash';

// app
import {Analytics, AnalyticsService} from '../../analytics/index';
import {LogService, ProgressService, DialogsService, FancyAlertService} from '../../core/index';
import {PlaylistModel, TrackModel, PLAYER_ACTIONS, FIREBASE_ACTIONS, ShoutoutService, SHOUTOUT_ACTIONS} from '../index';

declare var zonedCallback: Function;

// analytics
const CATEGORY: string = 'Playlist';

/**
 * ngrx setup start --
 */
export interface PlaylistStateI {
  playing?: boolean;
  showPicker?: boolean;
}

interface PLAYLIST_ACTIONSI {
  SHOW_PICKER: string;
  CLOSE_PICKER: string;
  LOOP_NEXT: string;
  NOOP: string;
  SHOW_RECORD: string;
}

export const PLAYLIST_ACTIONS: PLAYLIST_ACTIONSI = {
  SHOW_PICKER: `[${CATEGORY}] SHOW_PICKER`,
  CLOSE_PICKER: `[${CATEGORY}] CLOSE_PICKER`,
  LOOP_NEXT: `[${CATEGORY}] LOOP_NEXT`,
  NOOP: `[${CATEGORY}] NOOP`,
  SHOW_RECORD: `[${CATEGORY}] SHOW_RECORD`
};

export const playlistReducer: ActionReducer<PlaylistStateI> = (state: PlaylistStateI = {}, action: Action) => {
  let changeState = () => {
    if (action.payload && action.payload.showRecord !== true) {
      // always reset back
      // tmp hack ... cuz Router cannot be injected into PlaylistService directly
      action.payload.showRecord = false;
    } 
    return Object.assign({}, state, action.payload);
  };
  switch (action.type) {
    case PLAYLIST_ACTIONS.SHOW_PICKER:
      action.payload = { showPicker: true };
      return changeState();
    case PLAYLIST_ACTIONS.CLOSE_PICKER:
      action.payload = { showPicker: false };
      return changeState();
    case PLAYLIST_ACTIONS.SHOW_RECORD:
      action.payload = { showRecord: true };
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
  private selectedTrack: TrackModel;

  constructor(public analytics: AnalyticsService, private store: Store<any>, private logger: LogService, private loader: ProgressService, private dialogsService: DialogsService, private ngZone: NgZone, private fancyalert: FancyAlertService, @Inject(forwardRef(() => ShoutoutService)) private shoutoutService) {//private router: Router
    super(analytics);
    this.category = CATEGORY;

    this.state$ = store.select('playlist');
  }

  public togglePlay(playlistId: string, track?: TrackModel) {
    this.store.take(1).subscribe((s: any) => {
      this.logger.debug('PlaylistService.togglePlay: this.store.take(1).subscribe, should update playlist state');
      let playlists = [...s.firebase.playlists];
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
      
        this.ngZone.run(() => {
          this.store.dispatch({ type: PLAYER_ACTIONS.TOGGLE_PLAY, payload: { currentTrackId, playing } });
          this.store.dispatch({ type: FIREBASE_ACTIONS.UPDATE, payload: { playlists } });
        });
      }  
    });
  }

  public addPrompt(track: TrackModel) {
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
            this.dialogsService.success('Added!');
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
          this.shoutoutService.removeRecordings(filenames, true);
        });
      }
    }
  }

  private promptToRecord(track: TrackModel) {
    setTimeout(() => {
      this.fancyalert.action('Record a ShoutOut?', null, 'microphone', [
        new TNSFancyAlertButton({
          label: 'Yes!',
          action: () => {
            this.shoutoutService.quickRecordTrack = track;
            this.store.dispatch({ type: PLAYLIST_ACTIONS.SHOW_RECORD });
          }
        })
      ]);
    }, 1000);  
  }

  private create(name: string, track: TrackModel) {
    this.loader.show();
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
  constructor(private store: Store<any>, private logger: LogService, private updates$: StateUpdates<any>, private playlistService: PlaylistService) { }
  
  @Effect() deletedPlayist$ = this.updates$
    .whenAction(FIREBASE_ACTIONS.PLAYLIST_DELETED)
    .do((update) => {
      this.logger.debug(`PlaylistEffects.PLAYLIST_DELETED`);
      this.playlistService.clearTrackShoutouts(update.action.payload);
    })
    .filter(() => false);
  
  @Effect() loopNext$ = this.updates$
    .whenAction(PLAYLIST_ACTIONS.LOOP_NEXT)
    .do((update) => {
      let playlists = [];
      let playlistIndex = -1;
      let trackIndex = -1;
      let playlistId;
      let track;
      this.store.take(1).subscribe((s: any) => {
        let currentTrackId = s.player.currentTrackId;
        if (currentTrackId) {
          this.logger.debug(`PlaylistEffects.LOOP_NEXT`);
          playlists = [...s.firebase.playlists];
          for (let i = 0; i < playlists.length; i++) {
            for (let a = 0; a < playlists[i].tracks.length; a++) {
              if (playlists[i].tracks[a].id === currentTrackId) {
                playlistId = playlists[i].id;
                track = playlists[i].tracks[a];
                playlistIndex = i;
                trackIndex = a;
                this.logger.debug(`PlaylistEffects, found indices, playlistIndex: ${playlistIndex}, trackIndex: ${trackIndex}`);
                break;
              }
            }
          }
        }
      });
      if (playlists.length && playlistIndex > -1 && trackIndex > -1) {
        // loop playback
        trackIndex++;
        let trackId;
        if (trackIndex < playlists[playlistIndex].tracks.length) {
          trackId = playlists[playlistIndex].tracks[trackIndex].id;
          track = playlists[playlistIndex].tracks[trackIndex];
        } else {
          // start over from start
          trackId = playlists[playlistIndex].tracks[0].id;
          track = playlists[playlistIndex].tracks[0];
        }
        this.playlistService.togglePlay(playlistId, track);
        // return ({ type: PLAYER_ACTIONS.TOGGLE_PLAY, payload: { currentTrackId: trackId, playing: true } });
      }
      // else {
      //   return ({ type: PLAYLIST_ACTIONS.NOOP });
      // }
    })
    .filter(() => false);
}