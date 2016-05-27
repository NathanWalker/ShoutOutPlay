// angular
import {Injectable} from '@angular/core';
import {Router} from '@angular/router-deprecated';

// nativescript
import * as dialogs from 'ui/dialogs';

// libs
import {Store, ActionReducer, Action} from '@ngrx/store';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/take';
import {TNSTrack, Utils} from 'nativescript-spotify';
import * as _ from 'lodash';

// app
import {Analytics, AnalyticsService} from '../../analytics.framework/index';
import {LogService, ProgressService, DialogsService} from '../../core.framework/index';
import {PlaylistModel, TrackModel, PLAYER_ACTIONS, COUCHBASE_ACTIONS} from '../index';

// analytics
const CATEGORY: string = 'Playlist';

/**
 * ngrx setup start --
 */
export interface PlaylistStateI {
  list: Array<PlaylistModel>;
  selectedPlaylist?: PlaylistModel;
  playing?: boolean;
  showPicker?: boolean;
}

const initialState: PlaylistStateI = {
  list: []
};

interface PLAYLIST_ACTIONSI {
  CREATE: string;
  CREATED: string;
  SELECT: string;
  UPDATE_LIST: string;
  SHOW_PICKER: string;
  CLOSE_PICKER: string;
}

export const PLAYLIST_ACTIONS: PLAYLIST_ACTIONSI = {
  CREATE: `[${CATEGORY}] CREATE`,
  CREATED: `[${CATEGORY}] CREATED`,
  SELECT: `[${CATEGORY}] SELECT`,
  UPDATE_LIST: `[${CATEGORY}] UPDATE_LIST`,
  SHOW_PICKER: `[${CATEGORY}] SHOW_PICKER`,
  CLOSE_PICKER: `[${CATEGORY}] CLOSE_PICKER`
};

export const playlistReducer: ActionReducer<PlaylistStateI> = (state: PlaylistStateI = initialState, action: Action) => {
  let changeState = () => {
    return Object.assign({}, state, action.payload);
  };
  switch (action.type) {
    case PLAYLIST_ACTIONS.CREATED:
      action.payload = { list: [...state.list, action.payload] };
      return changeState();
    case PLAYLIST_ACTIONS.SELECT:
      action.payload = { selectedPlaylist: action.payload };
      return changeState();
    case PLAYLIST_ACTIONS.UPDATE_LIST:
      action.payload = { list: action.payload };
      return changeState();
    case PLAYLIST_ACTIONS.SHOW_PICKER:
      action.payload = { showPicker: true, selectedPlaylist: undefined };
      return changeState();
    case PLAYLIST_ACTIONS.CLOSE_PICKER:
      action.payload = { showPicker: false, selectedPlaylist: undefined };
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

  constructor(public analytics: AnalyticsService, private store: Store<any>, private logger: LogService, private loader: ProgressService, private dialogsService: DialogsService, private _router: Router) {
    super(analytics);
    this.category = CATEGORY;

    this.state$ = store.select('playlist');
    this.state$.subscribe((state: PlaylistStateI) => {
      if (state.selectedPlaylist) {
        this._router.navigate(['PlaylistDetail', { id: state.selectedPlaylist.id }]);
      }
    });
    
    store.select(state => state.couchbase.playlists).subscribe((playlists) => {
      this.store.dispatch({ type: PLAYLIST_ACTIONS.UPDATE_LIST, payload: playlists });
    });

    // store.select(state => state.router).subscribe((route) => {
    //   this.logger.debug(`route change --`);
    //   this.logger.debug(route);
    //   switch (route.url) {
    //     case '/playlist':
    //       // reset selection
    //       this.store.dispatch({ type: PLAYLIST_ACTIONS.SELECT, payload: undefined });
    //       break;
    //   }
    // });
  }

  public togglePlay(playlistId: string) {
    this.getRawPlaylists().then((list: Array<PlaylistModel>) => {
      let playlist: PlaylistModel;
      for (let p of list) {
        if (p.id === playlistId) {
          playlist = p;
          break;
        }
      }
      if (playlist.tracks.length) {
        this.store.dispatch({ type: PLAYER_ACTIONS.TOGGLE_PLAY, payload: { currentTrackId: playlist.tracks[0].id } }); 
      } else {
        Utils.alert('This playist contains 0 tracks to play.');
      }
    });
  }

  public addPrompt(track: TrackModel) {
    this.selectedTrack = track;
    this.getRawPlaylists().then((list: Array<PlaylistModel>) => {
      let rawPlaylists = list;
      let promptNew = () => {
        dialogs.prompt({
          title: 'Add to New Playlist...',
          okButtonText: 'Save',
          cancelButtonText: 'Cancel',
          inputType: dialogs.inputType.text
        }).then((r: any) => {
          this.create(r.text, track);
        });
      };
      
      if (rawPlaylists.length === 0) {
        // create playlist
        promptNew();
      } else {
        let existingLabel = 'Existing Playlist';
        let newLabel = 'New Playlist';
        dialogs.action({
          message: 'Add track to...',
          cancelButtonText: 'Cancel',
          actions: [existingLabel, newLabel]
        }).then((r: any) => {
          this.logger.debug(`User chose: ${r}`);
          switch (r) {
            case existingLabel:
              this.store.dispatch({ type: PLAYLIST_ACTIONS.SHOW_PICKER });
              break;
            case newLabel:
              promptNew();
              break;
          }
        });  
      }
    });
  } 

  public addTrackTo(playlistId: string) {
    this.store.take(1).subscribe((s: any) => {
      let playlists = [...s.playlist.list];
      for (let item of playlists) {
        if (item.id === playlistId) {
          if (item.addTrack(this.selectedTrack)) {
            this.store.dispatch({ type: COUCHBASE_ACTIONS.UPDATE, payload: { playlists } });
            this.dialogsService.success('Added!');
            break;
          } else {
            dialogs.alert(`Track was already added to that playlist.`);
            break;
          }
        }
      }  
    });
  }

  private create(name: string, track: TrackModel) {
    this.loader.show();
    this.logger.debug(`TODO: create playlist named '${name}', and add track: ${track.name}`);
    let newPlaylist = new PlaylistModel({ name });
    newPlaylist.addTrack(track);
    this.store.dispatch({ type: COUCHBASE_ACTIONS.CREATE_PLAYLIST, payload: newPlaylist });
  }

  private getRawPlaylists(): Promise<any> {
    return new Promise((resolve: any) => {
      this.store.take(1).subscribe((s: any) => {
        resolve(s.playlist.list);
      });
    })
  }
}