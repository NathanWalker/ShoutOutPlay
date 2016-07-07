import {OnDestroy} from '@angular/core';

// nativescript
import {SwipeDirection} from 'ui/gestures';
// libs
import {Store} from '@ngrx/store';
import {ModalDialogParams} from "nativescript-angular/directives/dialogs";
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/take';

// app
import {LogService, BaseComponent, ProgressService} from '../../shared/core/index';
import {ShoutoutModel, COUCHBASE_ACTIONS, ShoutoutService} from '../../shared/shoutoutplay/index';

@BaseComponent({
  moduleId: module.id,
  selector: 'shoutout-detail',
  templateUrl: `shoutout-detail.component.html`
})
export class ShoutOutDetailComponent implements OnDestroy {
  public shoutout: ShoutoutModel;
  public deleteConfirmed: boolean = false;
  public confirmTxt: string = `Swipe Left to Remove`;
  
  constructor(private store: Store<any>, private logger: LogService, private params: ModalDialogParams, private loader: ProgressService, private shoutoutService: ShoutoutService) {
    store.take(1).subscribe((state: any) => {
      let results = state.couchbase.shoutouts.filter(s => s.tmpId == this.params.context.id);
      if (results.length) {
        this.shoutout = results[0];
      }
    });
  } 

  public close() {
    this.params.closeCallback();
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