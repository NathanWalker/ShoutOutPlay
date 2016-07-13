import {RouterConfig} from '@angular/router';

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