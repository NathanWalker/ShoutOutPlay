// angular
import {NgZone, ViewChild, ElementRef, AfterViewInit} from '@angular/core';
import {Router} from '@angular/router';

// nativescript
import * as dialogs from 'ui/dialogs';
import * as utils from 'utils/utils';
import {topmost} from 'ui/frame';
import {GestureStateTypes} from 'ui/gestures';

// libs
import {Store} from '@ngrx/store';
import {Observable} from 'rxjs/Observable';
import {Subscription} from 'rxjs/Subscription';
import 'rxjs/add/operator/take';
import {isString, includes} from 'lodash';

// app
import {AnimateService, LogService, BaseComponent, ProgressService, FancyAlertService, DrawerService} from '../../shared/core/index';
import {PlaylistService, IPlaylistState, PlaylistModel, PLAYLIST_ACTIONS, IPlayerState, FirebaseService, FIREBASE_ACTIONS, IFirebaseState, IAuthState, ShoutoutService, SearchService, TrackControlService} from '../../shared/shoutoutplay/index';

declare var zonedCallback: Function;

@BaseComponent({
  // moduleId: module.id,
  selector: 'playlist',
  templateUrl: './components/playlist/playlist.component.html'
})
export class PlaylistComponent {
  public show: boolean = true;
  private _currentIndex: number;
  private _sub: Subscription;

  constructor(private store: Store<any>, private logger: LogService, public playlistService: PlaylistService, public firebaseService: FirebaseService, public drawerService: DrawerService, public trackControl: TrackControlService, private loader: ProgressService, private shoutoutService: ShoutoutService, private router: Router, private searchService: SearchService, private fancyalert: FancyAlertService, private ngZone: NgZone) {
    // always stop all tracks playing from search results
    searchService.stopAll();
  }

  public viewDetail(e: any) {
    this.logger.debug(`trying to nav to playlist at index: ${e.itemIndex}`);
    try {
      let listview: any = topmost().currentPage.getViewById("listview");
      if (listview) {
        listview.notifySwipeToExecuteFinished();
      }
    } catch (err) {
      this.logger.debug(err);
    }
    this.logger.debug(`getting state...`);
    this.store.take(1).subscribe((s: any) => {
      this.logger.debug(s.firebase);
      if (s.firebase.playlists && s.firebase.playlists.length) {
        this.logger.debug(s.firebase.playlists[e.itemIndex]);
        if (s.firebase.playlists[e.itemIndex]) {
          this.logger.debug(s.firebase.playlists[e.itemIndex].id);
          this.router.navigate(['/playlist', s.firebase.playlists[e.itemIndex].id]);
        } else {
          this.logger.debug(`playlist not found, index: ${e.itemIndex}`);
        }
      } else {
        this.logger.debug(`playlist doesn't exist at index: ${e.itemIndex}`);
      }
    });  
  }

  public edit(e: any) {
    this.store.take(1).subscribe((s: any) => {
      this.playlistService.edit(s.firebase.playlists[this._currentIndex]).then(() => {

      });
    });
  }

  public remove(e: any) {
    this.fancyalert.confirm('Are you sure you want to delete this playlist? All ShoutOuts attached to any tracks in this playlist will also be deleted.', 'warning', () => {
      this.store.take(1).subscribe((s: any) => {
        let playlist = s.firebase.playlists[this._currentIndex];
        this.store.dispatch({ type: FIREBASE_ACTIONS.DELETE, payload: playlist });
      });
    });
  }

  // public add() {
  //   this.fancyalert.prompt('Name', '', 'Add New Playlist...', 'plus', (value: any) => {
  //     this.loader.show();
  //     this.logger.debug(`Creating playlist named '${value}'`);
  //     let newPlaylist = new PlaylistModel({ name: value });
  //     this.store.take(1).subscribe((s: any) => {
  //       newPlaylist.order = s.firebase.playlists.length;
  //       this.store.dispatch({ type: FIREBASE_ACTIONS.CREATE, payload: newPlaylist });
  //     });
  //   });
  // } 

  public onSwipeCellStarted(args: any) {
    let density = utils.layout.getDisplayDensity();
    let delta = Math.floor(density) !== density ? 1.1 : .1;
    var swipeLimits = args.data.swipeLimits;  
    swipeLimits.top = 0;
    swipeLimits.bottom = 0;
    swipeLimits.left = Math.round(density * 100);
    swipeLimits.right = Math.round(density * 100);
    swipeLimits.threshold = Math.round(density * 50);
  }

  public onSwipeCellFinished(args: any) {
    // this.logger.debug(args.itemIndex);
    this._currentIndex = args.itemIndex;
    // if (args.data.x > 200) {
    //   this.logger.debug("Perform left action");
    //   this.edit(args.itemIndex);
    // } else if (args.data.x < -200) {
    //   this.logger.debug("Perform right action");
    //   this.remove(args.itemIndex);
    // }
  }

  public onItemReordered(args: any) {
    this.logger.debug("Item reordered. Old index: " + args.itemIndex + " " + "new index: " + args.data.targetIndex);
    this.store.dispatch({ type: FIREBASE_ACTIONS.REORDER, payload: { type: 'playlist', itemIndex: args.itemIndex, targetIndex: args.data.targetIndex } });
  }

  ngOnInit() {
    this._sub = this.store.select('auth').subscribe((state: IAuthState) => {
      if (!state.loggedIn) {
        this.router.navigate(['/']);
      }
    });
  }

  ngOnDestroy() {
    if (this._sub) {
      this._sub.unsubscribe();
    } 
  }
}