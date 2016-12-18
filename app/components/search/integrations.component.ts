import {OnDestroy} from '@angular/core';

// libs
import {Store} from '@ngrx/store';
import {ModalDialogParams} from "nativescript-angular";
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/take';

// app
import {LogService, BaseComponent} from '../../shared/core/index';

@BaseComponent({
  // moduleId: module.id,
  selector: 'integrations',
  templateUrl: './components/search/integrations.component.html'
})
export class IntegrationsComponent {
  public choices: any;

  constructor(private logger: LogService, private params: ModalDialogParams) {
    
  }

  public close(save?: boolean) {
    // for now, closing will also save choice (good way to report device usage)
    this.params.closeCallback(save ? this.choices : null);
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