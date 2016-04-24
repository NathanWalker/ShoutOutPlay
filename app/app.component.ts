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
import {PlayerService, CouchbaseService} from './frameworks/shoutoutplay.framework/index';
import {SearchComponent} from './components/search/search.component';
import {RecordComponent} from './components/record/record.component';
import {PlaylistComponent} from './components/playlist/playlist.component';
import {PlaylistDetailComponent} from './components/playlist/playlist-detail.component';

@Component({
  selector: 'my-app',
  template: `
    <page-router-outlet></page-router-outlet>
  `,
  directives: [NS_ROUTER_DIRECTIVES]
})
@RouteConfig([
  { path: '/',            name: 'Search',         component: SearchComponent },
  { path: '/record',      name: 'Record',         component: RecordComponent },
  { path: '/playlist',    name: 'Playlist',       component: PlaylistComponent },
  { path: '/playlist/:id',name: 'PlaylistDetail', component: PlaylistDetailComponent }
])  
export class AppComponent {

  constructor(private pluginService: TNSFontIconService, private player: PlayerService, private couchbase: CouchbaseService) {
    ActionBarUtil.STATUSBAR_STYLE(1);
  }
}