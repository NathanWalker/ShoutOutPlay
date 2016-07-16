// this import should be first in order to load some required settings (like globals and reflect-metadata)
import {nativeScriptBootstrap} from 'nativescript-angular/application';

// nativescript
import {SIDEDRAWER_PROVIDERS} from "nativescript-telerik-ui-pro/sidedrawer/angular";
import {LISTVIEW_PROVIDERS} from 'nativescript-telerik-ui-pro/listview/angular';
import * as app from 'application';

// angular
import {provide} from '@angular/core';

// config
import {CoreConfigService} from './shared/core/index';
CoreConfigService.DEBUG.LEVEL_4 = true;

// libs
import {provideStore} from '@ngrx/store';
import {runEffects} from '@ngrx/effects';
import {TNSFontIconService} from 'nativescript-ng2-fonticon/nativescript-ng2-fonticon';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/observable/of';

// app
import {CORE_PROVIDERS, ConsoleService, SpotifyAppDelegate} from './shared/core/index';
import {ANALYTICS_PROVIDERS} from './shared/analytics/index';
import {
  SHOUTOUTPLAY_PROVIDERS,
  authReducer,
  firebaseReducer,
  FirebaseEffects,
  playerReducer,
  playlistReducer,
  PlaylistEffects,
  searchReducer,
  shoutoutReducer
} from './shared/shoutoutplay/index';
import {AppComponent} from './app.component';
import {APP_ROUTES_PROVIDER} from './app.routes';

// Spotify setup
if (app.ios) {
  app.ios.delegate = SpotifyAppDelegate;
}

nativeScriptBootstrap(AppComponent, [
  APP_ROUTES_PROVIDER,
  SIDEDRAWER_PROVIDERS,
  LISTVIEW_PROVIDERS,
  { provide: ConsoleService, useValue: console },
  CORE_PROVIDERS,
  ANALYTICS_PROVIDERS,
  SHOUTOUTPLAY_PROVIDERS,
  { provide: TNSFontIconService, useFactory: () => {
      return new TNSFontIconService({
        'fa': 'font-awesome.css'
      });
    }
  },
  provideStore({
    auth: authReducer,
    firebase: firebaseReducer,
    player: playerReducer,
    playlist: playlistReducer,
    search: searchReducer,
    shoutout: shoutoutReducer
  }),
  runEffects(
    FirebaseEffects,
    PlaylistEffects
  )
], { startPageActionBarHidden: false }); // https://github.com/NativeScript/nativescript-angular/issues/121