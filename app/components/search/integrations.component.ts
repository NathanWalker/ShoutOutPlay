import {OnDestroy} from '@angular/core';

// libs
import {Store} from '@ngrx/store';
import {ModalDialogParams} from "nativescript-angular/directives/dialogs";
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/take';

// app
import {LogService, BaseComponent} from '../../shared/core/index';

@BaseComponent({
  // moduleId: module.id,
  selector: 'track-chooser',
  templateUrl: './components/record/track-chooser.component.html'
})
export class IntegrationsComponent {
  public choices: any;

  constructor(private logger: LogService, private params: ModalDialogParams) {
    
  }

  public close() {
    this.params.closeCallback(this.choices);
  }

  ngOnInit() {
    this.choices = {
      apple: false,
      google: false,
      soundcloud: false,
      groove: false,
      pandora: false,
      amazon: false,
      plug: false
    };
  }
}