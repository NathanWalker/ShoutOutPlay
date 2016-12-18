import {OnDestroy} from '@angular/core';

// nativescript
import {Page} from 'ui/page';
import {SwipeDirection} from 'ui/gestures';

// libs
import {Store} from '@ngrx/store';
import {ModalDialogParams} from "nativescript-angular";
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/take';

// app
import {LogService, BaseComponent, PROGRESS_ACTIONS} from '../../shared/core/index';
import {TrackModel, ShoutoutModel, FIREBASE_ACTIONS, ShoutoutService, TrackControlService} from '../../shared/shoutoutplay/index';

@BaseComponent({
  // moduleId: module.id,
  selector: 'shoutout-detail',
  templateUrl: './components/shoutout/shoutout-detail.component.html'
})
export class ShoutOutDetailComponent implements OnDestroy {
  public shoutout: ShoutoutModel;
  public deleteConfirmed: boolean = false;
  public confirmTxt: string = `Swipe Left to Remove`;
  private _track: TrackModel;
  
  constructor(private store: Store<any>, private logger: LogService, private params: ModalDialogParams, private shoutoutService: ShoutoutService, private trackControl: TrackControlService, private page: Page) {
    page.backgroundSpanUnderStatusBar = true;

    this._track = this.params.context.track;
    store.take(1).subscribe((state: any) => {
      let results = state.firebase.shoutouts.filter(s => s.id == this._track.shoutoutId);
      if (results.length) {
        this.shoutout = results[0];
      }
    });
  } 

  public close() {
    this.params.closeCallback();
  }

  public share() {
    this.trackControl.openShareOptions(this.shoutout, this._track);
  }

  public swipeConfirm(e: any) {
    if (e.direction === SwipeDirection.left) {
      this.deleteConfirmed = true;
      this.confirmTxt = `Yes, Remove ShoutOut`;
    }
  }
    
  public remove() {
    if (this.deleteConfirmed) {
      this.shoutoutService.removeShoutout(this.shoutout).then(() => {
        this.close();
      })
    } 
  }

  ngOnDestroy() {

  }
}