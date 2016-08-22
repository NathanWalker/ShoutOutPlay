import {ChangeDetectionStrategy} from '@angular/core';
// libs
import {Store} from '@ngrx/store';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/take';
var themes = require('nativescript-themes');

// app
import {LogService, BaseComponent, ColorService} from '../../shared/core/index';
import {FIREBASE_ACTIONS} from '../../shared/shoutoutplay/index';

@BaseComponent({
  // moduleId: module.id,
  selector: 'settings-theme',
  templateUrl: './components/settings/theme.component.html',
  changeDetection: ChangeDetectionStrategy.Default
})
export class ThemeComponent {
  public activeTheme: number = 0;

  constructor(private store: Store<any>) {

  }  

  public changeTheme(type?: string) {
    switch (type) {
      case 'gray':
        this.activeTheme = 1;
        ColorService.swapScheme(1);
        themes.applyTheme('yellow-theme.css');
        break;
      default:
        this.activeTheme = 0;
        ColorService.swapScheme(0);
        themes.applyTheme('app.css');
        break;
    }
  }
}