// angular
import {ChangeDetectionStrategy} from '@angular/core';
// import {ViewChild, AfterViewInit} from '@angular/core';
import {RouteConfig} from '@angular/router-deprecated';

// nativescript
import {NS_ROUTER_DIRECTIVES} from 'nativescript-angular/router';
import {registerElement} from "nativescript-angular/element-registry"
registerElement("CardView", () => require("nativescript-cardview").CardView);
registerElement("AudioPlot", () => require("nativescript-ezaudio").AudioPlot);

// libs
import {TNSFontIconService} from 'nativescript-ng2-fonticon/nativescript-ng2-fonticon';

// app
import {ActionBarUtil, BaseComponent} from './frameworks/core.framework/index';
import {PlayerService, CouchbaseService} from './frameworks/shoutoutplay.framework/index';
import {SearchComponent} from './components/search/search.component';
import {RecordComponent} from './components/record/record.component';
import {PlaylistComponent} from './components/playlist/playlist.component';
import {PlaylistDetailComponent} from './components/playlist/playlist-detail.component';

// import {RadSideDrawerComponent, SideDrawerType} from './components/side-drawer/side-drawer-directives';
 
@BaseComponent({
  selector: 'my-app',
  template: `
    <ActionBar title="ShoutOutPlay"> 
      <StackLayout orientation="horizontal"
        ios:horizontalAlignment="center"
        android:horizontalAlignment="left">
        <!--<Image src="res://nativescript_logo" class="action-image"/>-->
        <Label text="ShoutOutPlay"  class="logo-text"></Label>
      </StackLayout>
      <!--<ActionItem (tap)="toggleMenu()">
        <Button class="fa" [text]="'fa-bars' | fonticon"></Button>
      </ActionItem>-->
      <ActionItem [nsRouterLink]="['/Playlist']">
        <Button text="Playlists"></Button>
      </ActionItem>
      <ActionItem [nsRouterLink]="['/Record']" ios.position="right" android.position="popup">
        <Button class="fa" [text]="'fa-microphone' | fonticon"></Button>
      </ActionItem>
    </ActionBar>
    <page-router-outlet></page-router-outlet>
  `,
  changeDetection: ChangeDetectionStrategy.Default
})
@RouteConfig([
  { path: '/',            name: 'Search',         component: SearchComponent },
  { path: '/record',      name: 'Record',         component: RecordComponent },
  { path: '/playlist',    name: 'Playlist',       component: PlaylistComponent },
  { path: '/playlist/:id',name: 'PlaylistDetail', component: PlaylistDetailComponent }
])  
export class AppComponent {//implements AfterViewInit {
  // @ViewChild(RadSideDrawerComponent) public drawerComponent: RadSideDrawerComponent;
  // private drawer: SideDrawerType;
  
  constructor(private pluginService: TNSFontIconService, private player: PlayerService, private couchbase: CouchbaseService) {
    ActionBarUtil.STATUSBAR_STYLE(1);
  }

  // public toggleMenu() {
  //   this.drawer.toggleDrawerState();
  // }

  // ngAfterViewInit() {
  //   this.drawer = this.drawerComponent.sideDrawer;
  // }
}