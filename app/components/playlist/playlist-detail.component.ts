// angular
import {NgZone} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

// nativescript
import {ModalDialogService, ModalDialogHost, ModalDialogOptions} from "nativescript-angular/directives/dialogs";
import * as dialogs from 'ui/dialogs';
import {topmost} from 'ui/frame';
import * as utils from 'utils/utils';

// libs
import {Store} from '@ngrx/store';

// app
import {AnimateService, LogService, BaseComponent, FancyAlertService} from '../../shared/core/index';
import {PlaylistService, PlaylistStateI, PlaylistModel, PLAYER_ACTIONS, PLAYLIST_ACTIONS, TrackModel, COUCHBASE_ACTIONS, CouchbaseStateI, CouchbaseService, EmptyComponent} from '../../shared/shoutoutplay/index';
import {ShoutOutDetailComponent} from '../shoutout/shoutout-detail.component';

declare var zonedCallback: Function;

@BaseComponent({
  moduleId: module.id,
  selector: 'playlist-detail',
  templateUrl: `playlist-detail.component.html`,
  directives: [ModalDialogHost, EmptyComponent],
  providers: [ModalDialogService]
})
export class PlaylistDetailComponent {
  public playlistIndex: number;
  private _playlist: PlaylistModel;
  private _swipedView: any;
  private _currentIndex: number;

  constructor(private store: Store<any>, private logger: LogService, public playlistService: PlaylistService, private couchbaseService: CouchbaseService, private ar: ActivatedRoute, private modal: ModalDialogService, private fancyalert: FancyAlertService, private ngZone: NgZone) {
    ar.params.map(r => r['id']).take(1).subscribe((id: string) => {
      console.log(`PlaylistDetailComponent id: ${id}`);
      store.take(1).subscribe((s: any) => {
        for (let i = 0; i < s.couchbase.playlists.length; i++) {
          if (s.couchbase.playlists[i].id === id) {
            this._playlist = Object.assign({}, s.couchbase.playlists[i]);
            this.playlistIndex = i;
            break;
          }
        }
      });
    });
  } 

  public viewShoutout(track: TrackModel) {
    this.ngZone.run(() => {
      let options: ModalDialogOptions = {
        context: { id: track.shoutoutId },
        fullscreen: false
      };
      this.modal.showModal(ShoutOutDetailComponent, options).then(zonedCallback(() => {
        
      }));
    });
  }

  public edit() {
    this.playlistService.edit(this._playlist).then((p) => {
      this._playlist.name = p.name;
      var actionBar = topmost().currentPage.actionBar;
      actionBar.title = p.name;
    });
  }

  public remove(e: any) {
    this.fancyalert.confirm('Are you sure you want to remove this track?', 'warning', () => {
      let playlistId = this._playlist.id;
      let track = this._playlist.tracks[this._currentIndex];
      if (track.shoutoutId) {
        // TODO: remove shoutout here via shoutoutService
        // Or change these to PROCESS_UPDATES for both (playlist/shoutouts)
      }
      this.store.dispatch({ type: COUCHBASE_ACTIONS.DELETE_TRACK, payload: { track, playlistId } });
      // AnimateService.SWIPE_RESET(this._swipedView);
    });
    // dialogs.confirm('Are you sure you want to remove this track?').then(zonedCallback((result) => {
    //   if (result) {
    //     let playlistId = this._playlist.id;
    //     this.store.dispatch({ type: COUCHBASE_ACTIONS.DELETE_TRACK, payload: { track, playlistId } });
    //     AnimateService.SWIPE_RESET(this._swipedView);
    //   }
    // }));
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
    swipeLimits.left = Math.round(density * 100);
    swipeLimits.right = Math.round(density * 100);
    swipeLimits.threshold = Math.round(density * 50);
  }

  public onSwipeCellFinished(args: any) {
    this._currentIndex = args.itemIndex;
  }

  public onItemReordered(args: any) {
    this.logger.debug("Item reordered. Old index: " + args.itemIndex + " " + "new index: " + args.data.targetIndex);
  }
}