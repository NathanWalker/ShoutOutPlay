// angular
import {Injectable, Inject, forwardRef, NgZone} from '@angular/core';

// libs
import {Store, ActionReducer, Action} from '@ngrx/store';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/take';
import {TNSSpotifySearch, TNSTrack, Utils} from 'nativescript-spotify';

// app
import {Analytics, AnalyticsService} from '../../analytics/index';
import {ProgressService, LogService, FancyAlertService, TextService} from '../../core/index';
import {IPlayerState, PLAYER_ACTIONS, TrackModel, FIREBASE_ACTIONS} from '../../shoutoutplay/index';

// analytics
const CATEGORY: string = 'Search';

/**
 * ngrx setup start --
 */
export interface ISearchState {
  term?: string;
  results?: Array<TrackModel>;
}

const initialState: ISearchState = {
  results: []
};

interface ISEARCH_ACTIONS {
  RESULTS_CHANGE: string;
}

export const SEARCH_ACTIONS: ISEARCH_ACTIONS = {
  RESULTS_CHANGE: `[${CATEGORY}] RESULTS_CHANGE`
};

export const searchReducer: ActionReducer<ISearchState> = (state: ISearchState = initialState, action: Action) => {
  let changeState = () => {
    return Object.assign({}, state, action.payload);
  };
  switch (action.type) {
    case SEARCH_ACTIONS.RESULTS_CHANGE:
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
  private _currentQuery: string;
  private _currentOffset: number = 0;
  private _hasMore: boolean = true;
  private _searchSpinnerTimeout: any;

  constructor(public analytics: AnalyticsService, private logger: LogService, private store: Store<any>, private loader: ProgressService, private ngZone: NgZone, private fancyalert: FancyAlertService) {
    super(analytics);
    this.category = CATEGORY;

    this.state$ = store.select('search');

    // listen to player state changes to update `playing` state of tracks in results
    store.select('player').subscribe((player: IPlayerState) => {
      if (player.previewTrackId && !player.stopped) {
        this.logger.debug(`SearchService player state changed, updating result list state...`);
        this.logger.debug(`playerState.playing: ${player.playing}`);
        this.updateTracks(player);
      }
    });
  }

  public togglePreview(track: TrackModel) {
    this.logger.debug(`togglePreview -- track is currently playing: ${track.playing}`);
    this.store.dispatch({ type: PLAYER_ACTIONS.TOGGLE_PLAY, payload: { previewTrackId: track.id, playing: !track.playing } });
    this.store.dispatch({ type: FIREBASE_ACTIONS.RESET_PLAYLISTS });
  }

  public stopAll() {
    this.store.take(1).subscribe((s: any) => {
      let previewTrackId;
      for (let track of s.search.results) {
        if (track.playing) {
          previewTrackId = track.id;
        } 
      }
      if (previewTrackId) {
        // stop that playing track
        this.store.dispatch({ type: PLAYER_ACTIONS.TOGGLE_PLAY, payload: { previewTrackId, playing: false } });
      }
    });
  }

  public search(query: string, queryType?: string, offset?: number) {
    queryType = queryType || 'track';
    if (typeof offset === 'undefined') offset = 0;

    if (this._currentQuery !== query) {
      this._currentQuery = query;
      // reset offset whenever query changes
      this._currentOffset = offset = 0;
    }
    
    this.loader.show({ message: this._currentOffset > 0 ? 'Loading more results...' : 'Searching...' });
    this.logger.debug(`loading offset: ${this._currentOffset}`);

    this._searchSpinnerTimeout = setTimeout(() => {
      // prevent infinite load on search
      this.fancyalert.show(TextService.SPOTIFY_SEARCH_DELAY_NOTICE);
      this.loader.hide();
    }, 6000);
    
    TNSSpotifySearch.QUERY(query, queryType, offset).then((result) => {
      if (result && result.tracks) {
        this._hasMore = result.hasNextPage;
        // for (let key in result) {
        //     console.log('---');
        //     console.log(key);
        //     console.log(result[key]);
        //   }
        if (this._currentOffset > 0) {
          this.store.take(1).subscribe((s: any) => {
            if (s.search) {
              this.resultChange([...s.search.results, ...result.tracks], query);
            }
          });
        } else {
          this.resultChange(result.tracks, query);
        }
      } else {
        this.searchError();
      }    
    }, () => {
      this.searchError();
    });
  }

  public searchMore() {
    if (this._hasMore) {
      this._currentOffset = this._currentOffset + 20;
      this.search(this._currentQuery, null, this._currentOffset);
      setTimeout(() => {
        // fallback to prevent infinte spin in case search above never returns
        this.loader.hide();
      }, 2000);
    }
  }

  private resetTimeout() {
     if (this._searchSpinnerTimeout) {
      clearTimeout(this._searchSpinnerTimeout);
      this._searchSpinnerTimeout = undefined;
    }
  }

  private searchError() {
    this.loader.hide();
    this.resetTimeout();
    Utils.alert('No tracks found. Try using only 2 words of the track name.');
  }

  private resultChange(tracks: Array<TNSTrack>, term: string) {
    this.loader.hide();
    this.track(SEARCH_ACTIONS.RESULTS_CHANGE, { label: term });
    // convert to TrackModel
    let results: Array<TrackModel> = [];
    for (let track of tracks) {
      results.push(new TrackModel(track));
    }
    this.store.dispatch({ type: SEARCH_ACTIONS.RESULTS_CHANGE, payload: { results, term } });
  }

  private updateTracks(player: IPlayerState) {
    let id = player.previewTrackId;
    this.store.take(1).subscribe((s: any) => {
      let results = [...s.search.results];
      for (let item of results) {
        if (item.id === id) {
          item.playing = player.playing;
        } else {
          // this ensures when track changes, all other item playing state is turned off
          item.playing = false;
        }
      }
      this.ngZone.run(() => {
        this.store.dispatch({ type: SEARCH_ACTIONS.RESULTS_CHANGE, payload: { results } });
      });
    });
  }
}