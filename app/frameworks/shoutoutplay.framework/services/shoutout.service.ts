// angular
import {Injectable} from 'angular2/core';

// libs
import {Store, Reducer, Action} from '@ngrx/store';
import {Observable} from 'rxjs/Rx';

// app
import {Analytics, AnalyticsService} from '../../analytics.framework/index';

// analytics
const CATEGORY: string = 'Shoutout';

/**
 * ngrx setup start --
 */
const initialState: Array<string> = [];

export const SHOUTOUT_ACTIONS: any = {
  INIT: `[${CATEGORY}] INIT`,
  UPDATE: `[${CATEGORY}] UPDATE`,
  CREATE: `[${CATEGORY}] CREATE`
};

export const shoutoutReducer: Reducer<any> = (state: any = [], action: Action) => {
  switch (action.type) {
    case SHOUTOUT_ACTIONS.INIT:
      return [...action.payload];
    case SHOUTOUT_ACTIONS.CREATE:
      return [...state, action.payload];
    default:
      return state;
  }
};
/**
 * ngrx end --
 */

@Injectable()
export class ShoutoutService extends Analytics {
  public shoutOuts: Observable<any>;

  constructor(public analytics: AnalyticsService, private store: Store<any>) {
    super(analytics);
    this.category = CATEGORY;

    this.shoutOuts = store.select('shoutOuts');

    this.init();   
  }

  private init() {
    // TODO: init shoutouts from app settings or local store of some sort (using {N}) 
    let userShoutouts = [];
    this.store.dispatch({ type: SHOUTOUT_ACTIONS.INIT, payload: userShoutouts });
  }
}