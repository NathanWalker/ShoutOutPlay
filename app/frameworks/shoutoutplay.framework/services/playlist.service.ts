// angular
import {Injectable} from 'angular2/core';
import {Router} from 'angular2/router';

// nativescript
import * as dialogs from 'ui/dialogs';

// libs
import {Store, Reducer, Action} from '@ngrx/store';
import {Observable} from 'rxjs/Rx';
import {TNSTrack, Utils} from 'nativescript-spotify';

// app
import {Analytics, AnalyticsService} from '../../analytics.framework/index';
import {LogService, ProgressService} from '../../core.framework/index';
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
}

const initialState: PlaylistStateI = {
  list: []
};

interface PLAYLIST_ACTIONSI {
  CREATE: string;
  CREATED: string;
  SELECT: string;
  UPDATE_LIST: string;
}

export const PLAYLIST_ACTIONS: PLAYLIST_ACTIONSI = {
  CREATE: `[${CATEGORY}] CREATE`,
  CREATED: `[${CATEGORY}] CREATED`,
  SELECT: `[${CATEGORY}] SELECT`,
  UPDATE_LIST: `[${CATEGORY}] UPDATE_LIST`
};

export const playlistReducer: Reducer<PlaylistStateI> = (state: PlaylistStateI = initialState, action: Action) => {
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

  constructor(public analytics: AnalyticsService, private store: Store<any>, private logger: LogService, private loader: ProgressService, private _router: Router) {
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

    store.select(state => state.router).subscribe((route) => {
      this.logger.debug(`route change --`);
      this.logger.debug(route);
      switch (route.url) {
        case '/playlist':
          // reset selection
          this.store.dispatch({ type: PLAYLIST_ACTIONS.SELECT, payload: undefined });
          break;
      }
    });
  }

  public togglePlay(playlistId: string) {
    let playlist: PlaylistModel;
    for (let p of this.getRawPlaylists()) {
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
  }

  public addPrompt(track: TrackModel) {
    let rawPlaylists = this.getRawPlaylists();

    let promptNew = () => {
      dialogs.prompt({
        title: 'Create a Playlist',
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
            this.logger.debug('open existing playlist picker modal');
            break;
          case newLabel:
            promptNew();
            break;
        }
      });  
    }
  } 

  private create(name: string, track: TrackModel) {
    this.loader.show();
    this.logger.debug(`TODO: create playlist named '${name}', and add track: ${track.name}`);
    let newPlaylist = new PlaylistModel({ name });
    newPlaylist.addTrack(track);
    this.store.dispatch({ type: COUCHBASE_ACTIONS.CREATE_PLAYLIST, payload: newPlaylist });
  }

  private addTrackTo(playlistId: string) {
    
  }

  private getRawPlaylists(): Array<PlaylistModel> {
    return this.store.getState().playlist.list;
  }
}