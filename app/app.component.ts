// angular
import {Component} from 'angular2/core';
import {RouteConfig} from 'angular2/router';

// nativescript
import {NS_ROUTER_DIRECTIVES} from 'nativescript-angular/router';
import {registerElement} from "nativescript-angular/element-registry"
registerElement("CardView", () => require("nativescript-cardview").CardView);

// libs
import {TNSFontIconService} from 'nativescript-ng2-fonticon/nativescript-ng2-fonticon';

// app
import {ActionBarUtil} from './frameworks/core.framework/index';
import {SearchComponent} from './components/search.component';
import {RecordComponent} from './components/record.component';
import {PlaylistComponent} from './components/playlist.component';
import {RecordlistComponent} from './components/recordlist.component';

@Component({
  selector: 'my-app',
  template: `
    <page-router-outlet></page-router-outlet>
  `,
  directives: [NS_ROUTER_DIRECTIVES]
})
@RouteConfig([
  { path: '/', component: SearchComponent, as: 'Search' },
  { path: '/record', component: RecordComponent, as: 'Record' },
  { path: '/playlist', component: PlaylistComponent, as: 'Playlist' },
  { path: '/recordlist', component: RecordlistComponent, as: 'Recordlist' }
])  
export class AppComponent {

  constructor(private pluginService: TNSFontIconService) {
    ActionBarUtil.STATUSBAR_STYLE(1);
  }
}