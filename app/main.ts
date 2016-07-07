// this import should be first in order to load some required settings (like globals and reflect-metadata)
import {nativeScriptBootstrap} from 'nativescript-angular/application';

// nativescript
import {nsProvideRouter} from 'nativescript-angular/router';
import {SIDEDRAWER_PROVIDERS} from "nativescript-telerik-ui-pro/sidedrawer/angular";
import {LISTVIEW_PROVIDERS} from 'nativescript-telerik-ui-pro/listview/angular';
import * as app from 'application';

// angular
import {provide} from '@angular/core';

// config
import {CoreConfigService} from './frameworks/core.framework/index';
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
import {CORE_PROVIDERS, ConsoleService, SpotifyAppDelegate} from './frameworks/core.framework/index';
import {ANALYTICS_PROVIDERS} from './frameworks/analytics.framework/index';
import {
  SHOUTOUTPLAY_PROVIDERS,
  authReducer,
  couchbaseReducer,
  CouchbaseEffects,
  playerReducer,
  playlistReducer,
  PlaylistEffects,
  searchReducer,
  shoutoutReducer
} from './frameworks/shoutoutplay.framework/index';
import {AppComponent} from './app.component';
import {routes} from './app.routes';

// Spotify setup
if (app.ios) {
  app.ios.delegate = SpotifyAppDelegate;
}

nativeScriptBootstrap(AppComponent, [
  nsProvideRouter(routes, { enableTracing: false }),
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
    couchbase: couchbaseReducer,
    player: playerReducer,
    playlist: playlistReducer,
    search: searchReducer,
    shoutout: shoutoutReducer
  }),
  runEffects(
    CouchbaseEffects,
    PlaylistEffects
  )
], { startPageActionBarHidden: false }); // https://github.com/NativeScript/nativescript-angular/issues/121