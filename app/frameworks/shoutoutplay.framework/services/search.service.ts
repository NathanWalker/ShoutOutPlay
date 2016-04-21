// angular
import {Injectable, Inject, forwardRef} from 'angular2/core';

// libs
import {Store, Reducer, Action} from '@ngrx/store';
import {Observable} from 'rxjs/Rx';
import {TNSSpotifySearch, Utils} from 'nativescript-spotify';

// app
import {Analytics, AnalyticsService} from '../../analytics.framework/index';
import {ProgressService} from '../../core.framework/index';
import {PlayerStateI, PLAYER_ACTIONS} from '../../shoutoutplay.framework/index';

// analytics
const CATEGORY: string = 'Search';

/**
 * ngrx setup start --
 */
export interface SearchStateI {
  term?: string;
  results?: Array<any>;
  previewTrackId?: string;
  playing?: boolean;
}

const initialState: SearchStateI = {
  results: [],
  playing: false
};

interface SEARCH_ACTIONSI {
  RESULTS_CHANGE: string;
  TOGGLE_PREVIEW: string;
}

export const SEARCH_ACTIONS: SEARCH_ACTIONSI = {
  RESULTS_CHANGE: `[${CATEGORY}] RESULTS_CHANGE`,
  TOGGLE_PREVIEW: `[${CATEGORY}] TOGGLE_PREVIEW`
};

export const searchReducer: Reducer<SearchStateI> = (state: SearchStateI = initialState, action: Action) => {
  let changeState = () => {
    return Object.assign({}, state, action.payload);
  };
  switch (action.type) {
    case SEARCH_ACTIONS.RESULTS_CHANGE:
      return changeState();
    case SEARCH_ACTIONS.TOGGLE_PREVIEW:
      return changeState();
    default:
      return state;
  }
};
/**
 * ngrx end --
 */

@Injectable()
export class SearchService extends Analytics {
  public state$: Observable<any>;

  // state helper
  private _currentPreviewId: string;
  private _playing: boolean;

  constructor(public analytics: AnalyticsService, private store: Store<any>, private loader: ProgressService) {
    super(analytics);
    this.category = CATEGORY;

    this.state$ = store.select('search');

    // listen to player state changes to update `playing` state of tracks in results
    store.select('player').subscribe((playerState: PlayerStateI) => {
      if (playerState) {
        this.updateTrack(playerState);
      }
    });
  }

  public togglePreview(trackId: string) {
    if (this._currentPreviewId !== trackId) {
      // new track change, always play instead of toggle
      this._playing = true;
    } else {
      this._playing = !this._playing;
    }
    this._currentPreviewId = trackId;
    this.store.dispatch({ type: SEARCH_ACTIONS.TOGGLE_PREVIEW, payload: { previewTrackId: this._currentPreviewId, playing: this._playing } });
  }

  public search(query: string, queryType?: string) {
    queryType = queryType || 'track';
    
    this.loader.show({ message: 'Searching...' });
    
    TNSSpotifySearch.QUERY(query, queryType).then((result) => {
      this.resultChange(result.tracks, query);
    }, () => {
      this.loader.hide();
      Utils.alert('No tracks found. Try using only 2 words of the track name.');
    });
  }

  private resultChange(tracks: Array<any>, query: string) {
    this.loader.hide();
    this.track(SEARCH_ACTIONS.RESULTS_CHANGE, { label: query });
    this.store.dispatch({ type: SEARCH_ACTIONS.RESULTS_CHANGE, payload: { results: tracks, term: query } });
  }

  private updateTrack(playerState: PlayerStateI) {
    if (playerState.previewTrack) {
      let id = playerState.previewTrack.split(':')[2];
      let updatedResults = this.store.getState().search.results;
      for (let item of updatedResults) {
        if (item.id === id) {
          item.playing = playerState.playing;
        } else {
          // this ensures when track changes, all other item playing state is turned off
          item.playing = false;
        }
      }
      this.store.dispatch({ type: SEARCH_ACTIONS.RESULTS_CHANGE, payload: { results: updatedResults } });
    }
  }
}