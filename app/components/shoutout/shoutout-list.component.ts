import {OnDestroy, NgZone} from '@angular/core';

// nativescript
import {isIOS} from 'platform';
import * as utils from 'utils/utils';
import {File} from 'file-system';
declare var TNSEZAudioPlayer;
if (isIOS) {
  let ezAudio = require('nativescript-ezaudio');
  TNSEZAudioPlayer = ezAudio.TNSEZAudioPlayer;
}

// libs
import {Store} from '@ngrx/store';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Subscription} from 'rxjs/Subscription';
import 'rxjs/add/operator/take';

// app
import {LogService, BaseComponent, FancyAlertService, TextService, Utils} from '../../shared/core/index';
import {ShoutoutModel, FIREBASE_ACTIONS, FirebaseStateI, ShoutoutService, FirebaseService} from '../../shared/shoutoutplay/index';

declare var zonedCallback: Function;

@BaseComponent({
  // moduleId: module.id,
  selector: 'shoutout-list',
  templateUrl: './components/shoutout/shoutout-list.component.html'
})
export class ShoutOutListComponent implements OnDestroy {
  public shoutouts$: BehaviorSubject<Array<any>> = new BehaviorSubject([]);
  private _currentIndex: number;
  private _shoutOutPlayer: any;
  private _currentShoutOut: any;
  private _sub: Subscription;

  constructor(private store: Store<any>, private logger: LogService, private shoutoutService: ShoutoutService, public firebaseService: FirebaseService, private fancyalert: FancyAlertService, private ngZone: NgZone) {
    this._shoutOutPlayer = new TNSEZAudioPlayer(true);
    this._shoutOutPlayer.delegate().audioEvents.on('reachedEnd', zonedCallback((eventData) => {
      this.logger.debug(`ShoutOutListComponent: audioEvents.on('reachedEnd')`);
      this.toggleShoutOutPlay(false, false);
    }));

    this._sub = this.store.select('firebase').subscribe((s: any) => {
      let playlists = [...s.playlists];
      let shoutouts = [...s.shoutouts];
      for (let shoutout of shoutouts) {
        // find track names
        for (let p of playlists) {
          for (let t of p.tracks) {
            if (t.shoutoutId === shoutout.id) {
              shoutout.track = t.name;
              break;
            }
          }
        }
      }
      this.shoutouts$.next(shoutouts);
    });
  } 

  public togglePlay(shoutout: any) {
    this.toggleShoutOutPlay(shoutout, (this._currentShoutOut ? shoutout.id !== this._currentShoutOut.id : true));
  } 

  private toggleShoutOutPlay(shoutout?: any, reload?: boolean) {
    if (shoutout) {
      // don't hang on to reference, instead create clone
      this._currentShoutOut = Object.assign({}, shoutout);
    }
   
    if (this._currentShoutOut && this._currentShoutOut.filename) {
      this.logger.debug(`_shoutOutPlayer.togglePlay`);
      let fullPath = Utils.documentsPath(this._currentShoutOut.filename);
      this.logger.debug(fullPath);
      if (File.exists(fullPath)) {
        this._shoutOutPlayer.togglePlay(fullPath, reload); 
        // adjust state
        this._currentShoutOut.playing = !this._currentShoutOut.playing;
        let shoutouts = [...this.shoutouts$.getValue()];
        for (let s of shoutouts) {
          if (s.id === this._currentShoutOut.id) {
            s.playing = this._currentShoutOut.playing;
            this.logger.debug(`set playing: ${s.playing}`);
          } else {
            s.playing = false;
          }
        }
        this.ngZone.run(() => {
          this.shoutouts$.next([...shoutouts]);
        });
      } else {
        // alert user
        this.fancyalert.show(TextService.SHOUTOUT_NOT_FOUND);
      }
    }
  }

  public remove(e: any) {
    this.fancyalert.confirm('Are you sure you want to delete this ShoutOut?', 'warning', () => {
      let shoutouts = [...this.shoutouts$.getValue()];
      this.shoutoutService.removeShoutout(shoutouts[this._currentIndex]);
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

  ngOnDestroy() {
    if (this._shoutOutPlayer) {
      this._shoutOutPlayer.delegate().audioEvents.off('reachedEnd');
      this._shoutOutPlayer = undefined;
    }
    if (this._sub) {
      this._sub.unsubscribe();
    }
  }
}