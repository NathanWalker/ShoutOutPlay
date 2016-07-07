import {RouterConfig} from '@angular/router';

import {IntroComponent} from './components/intro/intro.component';
import {SearchComponent} from './components/search/search.component';
import {RecordComponent} from './components/record/record.component';
import {PlaylistComponent} from './components/playlist/playlist.component';
import {PlaylistDetailComponent} from './components/playlist/playlist-detail.component';
import {ShoutOutListComponent} from './components/shoutout/shoutout-list.component';
import {ThemeComponent} from './components/settings/theme.component';
import {GeneralComponent} from './components/settings/general.component';
import {AboutComponent} from './components/settings/about.component';

export const routes: RouterConfig = [
    { path: "", component: SearchComponent },
    { path: "intro", component: IntroComponent },
    { path: "record", component: RecordComponent },
    { path: "playlist", component: PlaylistComponent },
    { path: "playlist/:id", component: PlaylistDetailComponent },
    { path: "shoutout", component: ShoutOutListComponent },
    { path: "theme", component: ThemeComponent },
    { path: "general", component: GeneralComponent },
    { path: "about", component: AboutComponent }
];