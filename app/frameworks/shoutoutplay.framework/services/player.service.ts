// angular
import {Injectable} from 'angular2/core';

// libs
import {Store, Reducer, Action} from '@ngrx/store';
import {Observable} from 'rxjs/Rx';

// app
import {Analytics, AnalyticsService} from '../../analytics.framework/index';

// analytics
const CATEGORY: string = 'Player';

/**
 * ngrx setup start --
 */
export const PLAYER_ACTIONS: any = {
  TRACK_CHANGE: `[${CATEGORY}] TRACK_CHANGE`
};

export const currentTrackReducer: Reducer<any> = (state: any = undefined, action: Action) => {
  switch (action.type) {
    case PLAYER_ACTIONS.TRACK_CHANGE:
      return Object.assign({}, state, action.payload);
    default:
      return state;
  }
};
/**
 * ngrx end --
 */

@Injectable()
export class PlayerService extends Analytics {
  public currentTrack: Observable<any>;

  constructor(public analytics: AnalyticsService, private store: Store<any>) {
    super(analytics);
    this.category = CATEGORY;

    this.currentTrack = store.select('currentTrack');
  }

  private trackChange(track: any) {
    this.track(PLAYER_ACTIONS.TRACK_CHANGE, { label: track });
    this.store.dispatch({ type: PLAYER_ACTIONS.TRACK_CHANGE, payload: track });
  }
}