// angular
import {Injectable} from 'angular2/core';

// libs
import {Store, Reducer, Action} from '@ngrx/store';
import {Observable} from 'rxjs/Rx';

// app
import {Analytics, AnalyticsService} from '../../analytics.framework/index';

// analytics
const CATEGORY: string = 'Search';

/**
 * ngrx setup start --
 */
export const SEARCH_ACTIONS: any = {
  SEARCH_RESULTS_CHANGE: `[${CATEGORY}] SEARCH_RESULTS_CHANGE`
};

export const searchReducer: Reducer<any> = (state: any = [], action: Action) => {
  switch (action.type) {
    case SEARCH_ACTIONS.SEARCH_RESULTS_CHANGE:
      return [action.payload];
    default:
      return state;
  }
};
/**
 * ngrx end --
 */

@Injectable()
export class SearchService extends Analytics {
  public searchResults: Observable<any>;
  public searchTerm: string;

  constructor(public analytics: AnalyticsService, private store: Store<any>) {
    super(analytics);
    this.category = CATEGORY;

    this.searchResults = store.select('searchResults');
  }

  private resultChange(results: Array<any>) {
    this.track(SEARCH_ACTIONS.SEARCH_RESULTS_CHANGE, { label: this.searchTerm });
    this.store.dispatch({ type: SEARCH_ACTIONS.SEARCH_RESULTS_CHANGE, payload: results });
  }
}