// import {Routes} from '@angular/router';

// import {HomeComponent} from './home/home.component';
// import {IntroComponent} from './intro/intro.component';
// import {WelcomeComponent} from './intro/welcome.component';
// import {PlayerControlsComponent} from './player/player-controls.component';
// import {PlayerFullComponent} from './player/player-full.component';
// import {PlaylistChooserComponent} from './playlist/playlist-chooser.component';
// import {PlaylistDetailComponent} from './playlist/playlist-detail.component';
// import {PlaylistComponent} from './playlist/playlist.component';
// import {RecordComponent} from './record/record.component';
// import {TrackChooserComponent} from './record/track-chooser.component';
// import {SearchComponent} from './search/search.component';
// import {AboutComponent} from './settings/about.component';
// import {GeneralComponent} from './settings/general.component';
// import {HelpComponent} from './settings/help.component';
// import {ThemeComponent} from './settings/theme.component';
// import {VideoComponent} from './settings/video.component';
// import {ShoutOutDetailComponent} from './shoutout/shoutout-detail.component';
// import {ShoutOutListComponent} from './shoutout/shoutout-list.component';

// export const COMPONENTS: any[] = [
//   HomeComponent,
//   IntroComponent,
//   WelcomeComponent,
//   PlayerControlsComponent,
//   PlayerFullComponent,
//   PlaylistChooserComponent,
//   PlaylistDetailComponent,
//   PlaylistComponent,
//   RecordComponent,
//   TrackChooserComponent,
//   SearchComponent,
//   AboutComponent,
//   GeneralComponent,
//   HelpComponent,
//   ThemeComponent,
//   VideoComponent,
//   ShoutOutDetailComponent,
//   ShoutOutListComponent
// ];

// export const routes: Routes = [
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