// this import should be first in order to load some required settings (like globals and reflect-metadata)
import {nativeScriptBootstrap} from 'nativescript-angular/application';

// nativescript
import {NS_ROUTER_PROVIDERS} from 'nativescript-angular/router';
import * as app from 'application';

// angular
import {provide} from '@angular/core';

// config
import {CoreConfigService} from './frameworks/core.framework/index';
CoreConfigService.DEBUG.LEVEL_4 = true;

// libs
import {provideStore} from '@ngrx/store';
import {TNSFontIconService} from 'nativescript-ng2-fonticon/nativescript-ng2-fonticon';

// app
import {CORE_PROVIDERS, ConsoleService, SpotifyAppDelegate} from './frameworks/core.framework/index';
import {ANALYTICS_PROVIDERS} from './frameworks/analytics.framework/index';
import {
  SHOUTOUTPLAY_PROVIDERS,
  authReducer,
  couchbaseReducer,
  playerReducer,
  playlistReducer,
  searchReducer,
  shoutoutReducer
} from './frameworks/shoutoutplay.framework/index';
import {AppComponent} from './app.component';

// import {SIDEDRAWER_PROVIDERS} from './components/side-drawer/side-drawer-directives';

// Spotify setup
if (app.ios) {
  app.ios.delegate = SpotifyAppDelegate;
}

nativeScriptBootstrap(AppComponent, [
  NS_ROUTER_PROVIDERS,
  // SIDEDRAWER_PROVIDERS,
  provide(ConsoleService, { useValue: console }),
  CORE_PROVIDERS,
  ANALYTICS_PROVIDERS,
  SHOUTOUTPLAY_PROVIDERS,
  provide(TNSFontIconService, {
    useFactory: () => {
      return new TNSFontIconService({
        'fa': 'font-awesome.css'
      });
    }
  }),
  provideStore({
    auth: authReducer,
    couchbase: couchbaseReducer,
    player: playerReducer,
    playlist: playlistReducer,
    search: searchReducer,
    shoutout: shoutoutReducer
  })
], { startPageActionBarHidden: false }); // https://github.com/NativeScript/nativescript-angular/issues/121