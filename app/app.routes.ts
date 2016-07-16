import {Injectable} from '@angular/core';
import {RouterConfig, CanActivate, RouterOutletMap} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/delay';
import 'rxjs/add/observable/of';

// nativescript
import {nsProvideRouter} from 'nativescript-angular/router';

import {HomeComponent} from './components/home/home.component';
import {IntroComponent} from './components/intro/intro.component';
import {SearchComponent} from './components/search/search.component';
import {RecordComponent} from './components/record/record.component';
import {PlaylistComponent} from './components/playlist/playlist.component';
import {PlaylistDetailComponent} from './components/playlist/playlist-detail.component';
import {ShoutOutListComponent} from './components/shoutout/shoutout-list.component';
import {ThemeComponent} from './components/settings/theme.component';
import {GeneralComponent} from './components/settings/general.component';
import {HelpComponent} from './components/settings/help.component';
import {AboutComponent} from './components/settings/about.component';
import {WelcomeComponent} from './components/intro/welcome.component';

@Injectable()
export class DelayGuard implements CanActivate {
  canActivate() {
    return Observable.of(true).delay(2000);
  }
}

// canActivate: [DelayGuard] 

// export const routes: RouterConfig = [
//   {
//     path: '',
//     redirectTo: '/home',
//     pathMatch: 'full'
//   },
//   {
//     path: "home",
//     component: HomeComponent,
//     children: [
//       { path: "", component: SearchComponent },
//       { path: "playlist", component: PlaylistComponent },
//       { path: "shoutout", component: ShoutOutListComponent },
//       { path: "theme", component: ThemeComponent },
//       { path: "general", component: GeneralComponent },
//       { path: "help", component: HelpComponent },
//       { path: "about", component: AboutComponent }
//     ]
//   },   
//   { path: "intro", component: IntroComponent },
//   { path: "record", component: RecordComponent },
//   { path: "playlist/:id", component: PlaylistDetailComponent },
//   { path: "welcome", component: WelcomeComponent }
// ];

export const routes: RouterConfig = [
  { path: "", component: SearchComponent },
  { path: "playlist", component: PlaylistComponent },
  { path: "shoutout", component: ShoutOutListComponent },
  { path: "theme", component: ThemeComponent },
  { path: "general", component: GeneralComponent },
  { path: "help", component: HelpComponent },
  { path: "about", component: AboutComponent },  
  { path: "intro", component: IntroComponent },
  { path: "record", component: RecordComponent },  
  { path: "playlist/:id", component: PlaylistDetailComponent },
  { path: "welcome", component: WelcomeComponent }
];

export const APP_ROUTES_PROVIDER = [
  nsProvideRouter(routes, {
    enableTracing: false
  })
]