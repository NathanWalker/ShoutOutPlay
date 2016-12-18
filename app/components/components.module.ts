// nativescript
import { NativeScriptModule, NativeScriptFormsModule, NativeScriptHttpModule, NativeScriptRouterModule } from 'nativescript-angular';
import { SIDEDRAWER_DIRECTIVES } from "nativescript-telerik-ui-pro/sidedrawer/angular";
import { LISTVIEW_DIRECTIVES } from 'nativescript-telerik-ui-pro/listview/angular';

// angular
import { NgModule } from '@angular/core';
import { Routes } from '@angular/router';

// libs
import { TNSFontIconModule } from 'nativescript-ng2-fonticon';

// feature module components
import {MainActionBarComponent} from '../shared/shoutoutplay/components/actionbar.component';
import {PlaylistActionBarComponent} from '../shared/shoutoutplay/components/playlist-actionbar.component';
import {SharedlistActionBarComponent} from '../shared/shoutoutplay/components/sharedlist-actionbar.component';
import {EmptyComponent} from '../shared/shoutoutplay/components/empty.component';

// app
import {HomeComponent} from './home/home.component';
import {IntroComponent} from './intro/intro.component';
import {PlayerControlsComponent} from './player/player-controls.component';
import {PlayerFullComponent} from './player/player-full.component';
import {PlaylistChooserComponent} from './playlist/playlist-chooser.component';
import {PlaylistDetailComponent} from './playlist/playlist-detail.component';
import {PlaylistComponent} from './playlist/playlist.component';
import {SharedListComponent} from './shared-list/shared-list.component';
import {RecordComponent} from './record/record.component';
import {TrackChooserComponent} from './record/track-chooser.component';
import {IntegrationsComponent} from './search/integrations.component';
import {SearchComponent} from './search/search.component';
import {AboutComponent} from './settings/about.component';
import {GeneralComponent} from './settings/general.component';
import {HelpComponent} from './settings/help.component';
import {ThemeComponent} from './settings/theme.component';
import {VideoComponent} from './settings/video.component';
import {ShoutOutDetailComponent} from './shoutout/shoutout-detail.component';
import {ShoutOutListComponent} from './shoutout/shoutout-list.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: "home",
    component: HomeComponent,
    children: [
      { path: "", component: SearchComponent },
      { path: "playlist", component: PlaylistComponent },
      { path: "shared", component: SharedListComponent },
      { path: "shoutout", component: ShoutOutListComponent },
      { path: "theme", component: ThemeComponent },
      { path: "general", component: GeneralComponent },
      { path: "help", component: HelpComponent },
      { path: "about", component: AboutComponent }
    ]
  },   
  { path: "intro", component: IntroComponent },
  { path: "record", component: RecordComponent },
  { path: "playlist/:id", component: PlaylistDetailComponent }
];

// components used as routes
export const ENTRY_COMPONENTS: any[] = [
  HomeComponent,
  SearchComponent,
  PlaylistComponent,
  SharedListComponent,
  ShoutOutListComponent,
  ThemeComponent,
  GeneralComponent,
  HelpComponent,
  AboutComponent,
  IntroComponent,
  RecordComponent,
  PlaylistDetailComponent
];

// components used by other components
export const AUX_COMPONENTS: any[] = [
  PlayerControlsComponent,
  MainActionBarComponent,
  PlaylistActionBarComponent,
  SharedlistActionBarComponent,
  EmptyComponent
];

// components dynamically created (modals)
export const FACTORY_COMPONENTS: any[] = [
  PlayerFullComponent,
  PlaylistChooserComponent,
  TrackChooserComponent,
  VideoComponent,
  ShoutOutDetailComponent,
  IntegrationsComponent
];

/**
 * Do not specify providers for modules that might be imported by a lazy loaded module.
 */

@NgModule({
  imports: [
    NativeScriptModule,
    NativeScriptFormsModule,
    NativeScriptHttpModule,
    NativeScriptRouterModule,
    TNSFontIconModule.forRoot({
      'fa': 'font-awesome.css'
    })
  ],
  entryComponents: [
    FACTORY_COMPONENTS
  ],
  declarations: [
    SIDEDRAWER_DIRECTIVES,
    LISTVIEW_DIRECTIVES,
    AUX_COMPONENTS,
    FACTORY_COMPONENTS
  ],
  exports: [
    SIDEDRAWER_DIRECTIVES,
    LISTVIEW_DIRECTIVES,
    AUX_COMPONENTS,
    FACTORY_COMPONENTS,
    NativeScriptModule,
    NativeScriptFormsModule,
    NativeScriptHttpModule,
    NativeScriptRouterModule,
    TNSFontIconModule
  ]
})
export class ComponentsModule {

}