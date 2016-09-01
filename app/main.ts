// require('nativescript-master-technology');
// this import should be first in order to load some required settings (like globals and reflect-metadata)
import { NativeScriptModule, platformNativeScriptDynamic, onAfterLivesync, onBeforeLivesync } from 'nativescript-angular/platform';
import { NativeScriptFormsModule } from 'nativescript-angular/forms';
import { NS_HTTP_PROVIDERS } from 'nativescript-angular/http';
import { NativeScriptRouterModule, NS_ROUTER_PROVIDERS } from 'nativescript-angular/router';
import {ModalDialogHost} from "nativescript-angular/directives/dialogs";
import {isIOS, device} from 'platform';
import * as app from 'application';

// NJA: Fix for iOS font registration during webpack
if (global.NSObject && global.NSString) {
  var font = require("ui/styling/font");
  font.ios.registerFont('RobotoRegular.ttf');
  font.ios.registerFont('fontawesome-webfont.ttf');
} 

// angular
import {NgModule, enableProdMode} from '@angular/core';

// config
import {Config} from './shared/core/index';
Config.DEBUG.LEVEL_4 = true;

// libs
import {TNSFontIconService, TNSFontIconPipe, TNSFontIconPurePipe} from 'nativescript-ng2-fonticon';
import {StoreModule} from '@ngrx/store';
import {EffectsModule} from '@ngrx/effects';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/observable/of';

// app
import {ConsoleService, SpotifyAppDelegate, ColorService} from './shared/core/index';
import {CoreModule} from './shared/core/core.module';
import {AnalyticsModule} from './shared/analytics/analytics.module';
import {ShoutOutPlayModule} from './shared/shoutoutplay/shoutoutplay.module';
import {
  authReducer,
  firebaseReducer,
  FirebaseEffects,
  playerReducer,
  playlistReducer,
  PlaylistEffects,
  searchReducer,
  shoutoutReducer,
  ShoutoutEffects
} from './shared/shoutoutplay/index';
import {ComponentsModule, routes, ENTRY_COMPONENTS} from './components/components.module';
import {AppComponent} from './app.component';

// Spotify setup
import {TNSSpotifyConstants, TNSSpotifyAuth} from 'nativescript-spotify';
TNSSpotifyConstants.CLIENT_ID = '1acac12e7fc448e188d8d70aa14249df';
TNSSpotifyAuth.REDIRECT_URL = 'shoutoutplay://spotifylogin';
if (isIOS) {
  app.ios.delegate = SpotifyAppDelegate;
}

// Theme (reapply any user chosen theme)
var themes = require('nativescript-themes');
var activeTheme = themes.getAppliedTheme('style/app.css');
// migrate from old css setup
if (activeTheme == 'app.css') {
  activeTheme = 'style/app.css';
} else if (activeTheme == 'yellow-theme.css') {
  activeTheme = 'style/gray.css';
}
themes.applyTheme(activeTheme);
// need to change colorservice (used for programmatic colors like in fancyalert)
ColorService.swapScheme(activeTheme.split('/').slice(-1)[0]);

enableProdMode();

@NgModule({
  imports: [
    CoreModule.forRoot([
      { provide: ConsoleService, useValue: console }
    ]),
    AnalyticsModule,
    StoreModule.provideStore({
      auth: authReducer,
      firebase: firebaseReducer,
      player: playerReducer,
      playlist: playlistReducer,
      search: searchReducer,
      shoutout: shoutoutReducer
    }),
    ShoutOutPlayModule,
    EffectsModule.run(FirebaseEffects),
    EffectsModule.run(PlaylistEffects),
    EffectsModule.run(ShoutoutEffects), 
    ComponentsModule,
    NativeScriptRouterModule.forRoot(routes)
  ],
  declarations: [
    AppComponent,
    ENTRY_COMPONENTS
  ],
  bootstrap: [AppComponent]
})

export class NativeModule { }

platformNativeScriptDynamic().bootstrapModule(NativeModule);
