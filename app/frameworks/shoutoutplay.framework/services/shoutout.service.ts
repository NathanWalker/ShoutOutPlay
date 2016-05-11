// angular
import {Injectable} from '@angular/core';

// libs
import {Store, Reducer, Action} from '@ngrx/store';
import {Observable} from 'rxjs/Rx';

// app
import {Analytics, AnalyticsService} from '../../analytics.framework/index';
import {LogService} from '../../core.framework/index';
import {ShoutoutModel} from '../index';

// analytics
const CATEGORY: string = 'Shoutout';

/**
 * ngrx setup start --
 */
export interface ShoutoutStateI {
  list: Array<ShoutoutModel>
}

const initialState: ShoutoutStateI = {
  list: []
};

interface SHOUTOUT_ACTIONSI {
  CREATE: string;
  UPDATE: string;
}

export const SHOUTOUT_ACTIONS: SHOUTOUT_ACTIONSI = {
  CREATE: `[${CATEGORY}] CREATE`,
  UPDATE: `[${CATEGORY}] UPDATE`
};

export const shoutoutReducer: Reducer<ShoutoutStateI> = (state: ShoutoutStateI = initialState, action: Action) => {
  let changeState = () => {
    return Object.assign({}, state, action.payload);
  };
  switch (action.type) {
    case SHOUTOUT_ACTIONS.CREATE:
      action.payload = { list: [...state.list, action.payload] };
      return changeState();
    case SHOUTOUT_ACTIONS.UPDATE:
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
export class ShoutoutService extends Analytics {
  public state$: Observable<any>;

  constructor(public analytics: AnalyticsService, private store: Store<any>, private logger: LogService) {
    super(analytics);
    this.category = CATEGORY;

    this.state$ = store.select('shoutout');

    store.select(state => state.couchbase.shoutouts).subscribe((shoutouts) => {
      this.store.dispatch({ type: SHOUTOUT_ACTIONS.UPDATE, payload: shoutouts });
    });
  }
}