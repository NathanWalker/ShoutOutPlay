import {ChangeDetectionStrategy} from '@angular/core';
// libs
import {Store} from '@ngrx/store';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/take';
var themes = require('nativescript-themes');

// app
import {Analytics, AnalyticsService} from '../../shared/analytics/index';
import {LogService, BaseComponent, ColorService} from '../../shared/core/index';
import {FIREBASE_ACTIONS} from '../../shared/shoutoutplay/index';

@BaseComponent({
  // moduleId: module.id,
  selector: 'settings-theme',
  templateUrl: './components/settings/theme.component.html',
  changeDetection: ChangeDetectionStrategy.Default
})
export class ThemeComponent extends Analytics {
  public activeTheme: string;

  constructor(public analytics: AnalyticsService, private store: Store<any>) {
    super(analytics);
    let currentTheme = themes.getAppliedTheme('style/app.css');
    console.log(`currentTheme: ${currentTheme}`);
    this.changeTheme(currentTheme.split('/').slice(-1)[0]); // just the filename
  }  

  public changeTheme(cssFilename: string) {
    this.activeTheme = cssFilename;
    themes.applyTheme(`style/${cssFilename}`);
    ColorService.swapScheme(cssFilename);
    this.track('CHANGE_THEME', { category: 'THEMES', label: cssFilename });
  }
}