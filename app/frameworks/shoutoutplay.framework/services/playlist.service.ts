// angular
import {Injectable} from 'angular2/core';

// libs
import {Store, Reducer, Action} from '@ngrx/store';
import {Observable} from 'rxjs/Rx';

// app
import {Analytics, AnalyticsService} from '../../analytics.framework/index';

// analytics
const CATEGORY: string = 'Playlist';

/**
 * ngrx setup start --
 */
const initialState: Array<string> = [];

export const PLAYLIST_ACTIONS: any = {
  INIT: `[${CATEGORY}] INIT`,
  UPDATE: `[${CATEGORY}] UPDATE`,
  CREATE: `[${CATEGORY}] CREATE`
};

export const playlistReducer: Reducer<any> = (state: any = [], action: Action) => {
  switch (action.type) {
    case PLAYLIST_ACTIONS.INIT:
      return [...action.payload];
    case PLAYLIST_ACTIONS.CREATE:
      return [...state, action.payload];
    default:
      return state;
  }
};
/**
 * ngrx end --
 */

@Injectable()
export class PlaylistService extends Analytics {
  public playlists: Observable<any>;

  constructor(public analytics: AnalyticsService, private store: Store<any>) {
    super(analytics);
    this.category = CATEGORY;

    this.playlists = store.select('playlists');

    this.init();   
  }

  private init() {
    // TODO: init playlists from app settings or local store of some sort (using {N}) 
    let userPlaylists = [];
    this.store.dispatch({ type: PLAYLIST_ACTIONS.INIT, payload: userPlaylists });
  }
}