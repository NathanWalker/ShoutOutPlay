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
import 'rxjs/add/operator/take';
import {isString, includes} from 'lodash';

// app
import {AnimateService, LogService, BaseComponent, ProgressService, FancyAlertService, DrawerService} from '../../shared/core/index';
import {PlaylistService, PlaylistStateI, PlaylistModel, PLAYLIST_ACTIONS, PlayerStateI, CouchbaseService, COUCHBASE_ACTIONS, CouchbaseStateI, ShoutoutService, SearchService, EmptyComponent} from '../../shared/shoutoutplay/index';

declare var zonedCallback: Function;

@BaseComponent({
  moduleId: module.id,
  selector: 'playlist',
  templateUrl: `playlist.component.html`,
  directives: [EmptyComponent]
})
export class PlaylistComponent {
  private _currentIndex: number;

  constructor(private store: Store<any>, private logger: LogService, public playlistService: PlaylistService, public couchbaseService: CouchbaseService, public drawerService: DrawerService, private loader: ProgressService, private shoutoutService: ShoutoutService, private router: Router, private searchService: SearchService, private fancyalert: FancyAlertService, private ngZone: NgZone) {
    // always stop all tracks playing from search results
    searchService.stopAll();
    
    // store.select('couchbase').subscribe((state: CouchbaseStateI) => {
    //   if (state.selectedPlaylistId && state.selecting) {
        
    //   }
    // });
  }

  public viewDetail(e: any) {
    (<any>topmost().currentPage.getViewById("listview")).notifySwipeToExecuteFinished();
    this.store.take(1).subscribe((s: any) => {
      this.router.navigate(['/playlist', s.couchbase.playlists[e.itemIndex].id]);
    });  
  }

  public edit(e: any) {
    this.store.take(1).subscribe((s: any) => {
      this.playlistService.edit(s.couchbase.playlists[this._currentIndex]).then(() => {

      });
    });
  }

  public remove(e: any) {
    this.fancyalert.confirm('Are you sure you want to delete this playlist?', 'warning', () => {
      this.store.take(1).subscribe((s: any) => {
        let playlist = s.couchbase.playlists[this._currentIndex];
        if (playlist.tracks.length) {
          let shoutoutIds = playlist.tracks.filter(track => isString(track.shoutoutId)).map(t => t.shoutoutId);
          if (shoutoutIds.length) {
            this.store.take(1).subscribe((s: any) => {
              let recordingPaths = s.couchbase.shoutouts.filter(s => includes(shoutoutIds, s.id)).map(s => s.recordingPath);
              this.shoutoutService.removeRecordings(recordingPaths);
            });
          }
        }
        this.store.dispatch({ type: COUCHBASE_ACTIONS.DELETE, payload: playlist });
      });
    });
  }

  public add() {
    this.fancyalert.prompt('Name', '', 'Add New Playlist...', 'plus', (value: any) => {
      this.loader.show();
      this.logger.debug(`Creating playlist named '${value}'`);
      let newPlaylist = new PlaylistModel({ name: value });
      this.store.dispatch({ type: COUCHBASE_ACTIONS.CREATE, payload: newPlaylist });
    });
  } 

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
  }
}