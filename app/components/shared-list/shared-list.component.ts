// angular
import {NgZone, OnInit} from '@angular/core';
import {Location} from '@angular/common';

// nativescript
import * as dialogs from 'ui/dialogs';
import {topmost} from 'ui/frame';
import * as utils from 'utils/utils';

// libs
import {Store} from '@ngrx/store';
import {Subscription} from 'rxjs/Subscription';

// app
import {AnimateService, LogService, BaseComponent, FancyAlertService, Config} from '../../shared/core/index';
import {SharedModel, PLAYER_ACTIONS, TrackModel, FIREBASE_ACTIONS, IFirebaseState, FirebaseService, SharedlistService, ShoutoutService, TrackControlService} from '../../shared/shoutoutplay/index';
import {ShoutOutDetailComponent} from '../shoutout/shoutout-detail.component';

@BaseComponent({
  // moduleId: module.id,
  selector: 'shared-list',
  templateUrl: './components/shared-list/shared-list.component.html'
})
export class SharedListComponent implements OnInit {
  private _currentIndex: number;
  private _sub: Subscription;

  constructor(private store: Store<any>, private logger: LogService, public firebaseService: FirebaseService, private fancyalert: FancyAlertService, private ngZone: NgZone, public sharedlistService: SharedlistService, public trackControl: TrackControlService, private location: Location) {
    logger.debug(`SharedListComponent constructor`);
  } 

  public togglePlay(shared: SharedModel) {
    this.store.dispatch({
      type: PLAYER_ACTIONS.LIST_TOGGLE_PLAY,
      payload: {
        activeList: 'shared',
        trackId: shared.trackId,
        activeShoutOutPath: shared.remoteFilePath
      }
    });
  }

  public remove(e: any) {
    this.store.take(1).subscribe((s: any) => {
      let shared = <SharedModel>s.firebase.sharedlist[this._currentIndex];
      if (shared) {
        this.fancyalert.confirm(`Are you sure you want to remove this shared ShoutOut from ${shared.sharedBy}?`, 'warning', () => {
          this.store.dispatch({ type: FIREBASE_ACTIONS.DELETE, payload: shared });
        });
      }
    });
  }

  public onSwipeCellStarted(args: any) {
    let density = utils.layout.getDisplayDensity();
    let delta = Math.floor(density) !== density ? 1.1 : .1;
    var swipeLimits = args.data.swipeLimits;  
    swipeLimits.top = 0;
    swipeLimits.bottom = 0;
    swipeLimits.left = 0;//Math.round(density * 100);
    swipeLimits.right = Math.round(density * 100);
    swipeLimits.threshold = Math.round(density * 50);
  }

  public onSwipeCellFinished(args: any) {
    this._currentIndex = args.itemIndex;
  }

  public onItemReordered(args: any) {
    this.logger.debug("Item reordered. Old index: " + args.itemIndex + " " + "new index: " + args.data.targetIndex);
    this.store.dispatch({ type: FIREBASE_ACTIONS.REORDER, payload: { type: 'shared', itemIndex: args.itemIndex, targetIndex: args.data.targetIndex } });
  }

  ngOnInit() {
    this._sub = Config.PLAY_SHARED$.subscribe((shared: SharedModel) => {
      // TODO: play shared item
      if (shared) {
        this.togglePlay(shared);
        Config.PLAY_SHARED$.next(null);
      }
    });
  }

  ngOnDestroy() {
    if (this._sub) this._sub.unsubscribe();
  }
}