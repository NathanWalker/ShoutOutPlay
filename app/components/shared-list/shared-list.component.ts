// angular
import {NgZone, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Location} from '@angular/common';

// nativescript
import {ModalDialogService, ModalDialogOptions} from "nativescript-angular/directives/dialogs";
import * as dialogs from 'ui/dialogs';
import {topmost} from 'ui/frame';
import * as utils from 'utils/utils';

// libs
import {Store} from '@ngrx/store';
import {Subscription} from 'rxjs/Subscription';

// app
import {AnimateService, LogService, BaseComponent, FancyAlertService, Config} from '../../shared/core/index';
import {PlaylistService, IPlaylistState, PlaylistModel, SharedModel, PLAYER_ACTIONS, PLAYLIST_ACTIONS, TrackModel, FIREBASE_ACTIONS, IFirebaseState, FirebaseService, SharedlistService, ShoutoutService} from '../../shared/shoutoutplay/index';
import {ShoutOutDetailComponent} from '../shoutout/shoutout-detail.component';

@BaseComponent({
  // moduleId: module.id,
  selector: 'shared-list',
  templateUrl: './components/shared-list/shared-list.component.html',
  providers: [ModalDialogService]
})
export class SharedListComponent implements OnInit {
  public playlistIndex: number;
  private _playlist: PlaylistModel;
  private _swipedView: any;
  private _currentIndex: number;
  private _sub: Subscription;

  constructor(private store: Store<any>, private logger: LogService, public playlistService: PlaylistService, private firebaseService: FirebaseService, private ar: ActivatedRoute, private modal: ModalDialogService, private fancyalert: FancyAlertService, private ngZone: NgZone, private router: Router, public sharedlistService: SharedlistService, private location: Location) {
    logger.debug(`SharedListComponent constructor`);
  } 

  public viewShoutout(track: TrackModel) {
    this.ngZone.run(() => {
      if (track.shoutoutId) {
        let options: ModalDialogOptions = {
          context: { id: track.shoutoutId },
          fullscreen: true
        };
        this.modal.showModal(ShoutOutDetailComponent, options).then(() => {
          
        });
      } else {
        Config.SELECTED_PLAYLIST_ID = this._playlist.id;
        this.shoutoutService.quickRecordTrack = track;
        this.router.navigate(['/record']);
      }
    });
  }

  public remove(e: any) {
    this.fancyalert.confirm('Are you sure you want to remove this shared ShoutOut?', 'warning', () => {
      this.store.take(1).subscribe((s: any) => {
        let shared = s.firebase.sharedlist[this._currentIndex];
        this.store.dispatch({ type: FIREBASE_ACTIONS.DELETE, payload: shared });
      });
      // AnimateService.SWIPE_RESET(this._swipedView);
    });
  }

  // public swipeReveal(e: any) {
  //   this._swipedView = AnimateService.SWIPE_REVEAL(e);
  // }

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
        this.sharedlistService.togglePlay(shared);
        Config.PLAY_SHARED$.next(null);
      }
    });
  }

  ngOnDestroy() {
    if (this._sub) this._sub.unsubscribe();
  }
}