// angular
import {Injectable} from '@angular/core';

// nativescript
import {isIOS} from 'platform';

// libs
import {Store, ActionReducer, Action} from '@ngrx/store';
import {Effect, Actions} from '@ngrx/effects';
import {LoadingIndicator, OptionsCommon} from 'nativescript-loading-indicator';

import {LogService} from './log.service';

declare var MBProgressHUDModeCustomView: any;

const CATEGORY: string = 'Progress';

/**
 * ngrx setup start --
 */
export interface IProgressState {
  visible?: boolean;
}

interface IPROGRESS_ACTIONS {
  SHOW: string;
  HIDE: string;
  SHOWN: string;
  HIDDEN: string;
  SUCCESS: string;
}

export const PROGRESS_ACTIONS: IPROGRESS_ACTIONS = {
  SHOW: `${CATEGORY}_SHOW`,
  HIDE: `${CATEGORY}_HIDE`,
  SHOWN: `${CATEGORY}_SHOWN`,
  HIDDEN: `${CATEGORY}_HIDDEN`,
  SUCCESS: `${CATEGORY}_SUCCESS`
};

export const progressReducer: ActionReducer<IProgressState> = (state: IProgressState = {}, action: Action) => {
  let changeState = () => {
    return Object.assign({}, state, action.payload);
  };
  switch (action.type) {
    case PROGRESS_ACTIONS.SHOWN:
      action.payload = { visible: true };
      return changeState();
    case PROGRESS_ACTIONS.HIDDEN:
      action.payload = { visible: false };
      return changeState();
    default:
      return state;
  }
};
/**
 * ngrx end --
 */

@Injectable()
export class ProgressService {
  private loader: LoadingIndicator;

  constructor() {
    this.loader = new LoadingIndicator();
  }

  public show(options?: OptionsCommon) {
    this.loader.show(options);
  }

  public hide() {
    this.loader.hide();
  }  

  public success(msg?: string) {
    let autoHide = () => {
      setTimeout(() => {
        this.hide();
      }, 1000);
    };
    if (isIOS) {
      this.show({ message: msg, ios: { mode: MBProgressHUDModeCustomView, customView: 'Checkmark.png' } });
      autoHide();
    } else {
      this.hide(); // ensure all progress dialogs are closed
      setTimeout(() => {
        this.show({ message: msg });
        autoHide();
      }, 400);
    }  
  }
}

@Injectable()
export class ProgressEffects {
  constructor(private store: Store<any>, private logger: LogService, private actions$: Actions, private progress: ProgressService) { }
      
  @Effect() show$ = this.actions$
    .ofType(PROGRESS_ACTIONS.SHOW)
    .map((action) => {
      this.logger.debug(`ProgressEffects.SHOW`);
      this.progress.show({ message: action.payload });
      return ({
        type: PROGRESS_ACTIONS.SHOWN
      });
    });

  @Effect() hide$ = this.actions$
    .ofType(PROGRESS_ACTIONS.HIDE)
    .map((action) => {
      this.logger.debug(`ProgressEffects.HIDE`);
      this.progress.hide();
      return ({
        type: PROGRESS_ACTIONS.HIDDEN
      });
    });

  @Effect() success$ = this.actions$
    .ofType(PROGRESS_ACTIONS.SUCCESS)
    .map((action) => {
      this.logger.debug(`ProgressEffects.SUCCESS`);
      this.progress.success(action.payload);
      return ({
        type: PROGRESS_ACTIONS.SHOWN
      });
    });
}