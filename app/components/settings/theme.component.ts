// libs
import {Store} from '@ngrx/store';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/take';
var themes = require('nativescript-themes');

// app
import {LogService, BaseComponent} from '../../frameworks/core.framework/index';
import {COUCHBASE_ACTIONS} from '../../frameworks/shoutoutplay.framework/index';

@BaseComponent({
  moduleId: module.id,
  selector: 'settings-theme',
  templateUrl: `theme.component.html`
})
export class ThemeComponent {

  constructor(private store: Store<any>) {

  }  

  public changeTheme(type?: string) {
    switch (type) {
      case 'gray':
        // TODO: gray/yellow 
        themes.applyTheme('yellow-theme.css');
        break;
      default:
        // TODO: use default
        themes.applyTheme('app.css');
        break;
    }
  }
}