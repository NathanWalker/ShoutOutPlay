// angular
import {ChangeDetectionStrategy, ChangeDetectorRef, Inject, ViewChild, AfterViewInit} from '@angular/core';
import {Router} from '@angular/router';

// nativescript
import {NS_ROUTER_DIRECTIVES, nsProvideRouter} from 'nativescript-angular/router';
import {RadSideDrawerComponent} from 'nativescript-telerik-ui-pro/sidedrawer/angular';
import {PushTransition, DrawerTransitionBase, SlideInOnTopTransition} from 'nativescript-telerik-ui-pro/sidedrawer';
import {Page} from "ui/page";

/* register elements */
import {registerElement} from "nativescript-angular/element-registry"
registerElement("CardView", () => require("nativescript-cardview").CardView);
registerElement("AudioPlot", () => require("nativescript-ezaudio").AudioPlot);
registerElement("Slide", () => require("nativescript-slides").Slide);
registerElement("SlideContainer", () => require("nativescript-slides").SlideContainer);
registerElement("Gif", () => require("nativescript-gif").Gif);

// libs
import {TNSFontIconService} from 'nativescript-ng2-fonticon/nativescript-ng2-fonticon';

// app
import {ActionBarUtil, BaseComponent, LogService, DrawerService} from './shared/core/index';
import {AuthService, PlayerService, CouchbaseService, PlaylistService} from './shared/shoutoutplay/index';
 
@BaseComponent({
  moduleId: module.id,
  selector: 'my-app',
  templateUrl: 'app.component.html',
  changeDetection: ChangeDetectionStrategy.Default
}) 
export class AppComponent implements AfterViewInit {
  public activeRoute: any = {
    search: true,
    playlist: false,
    shoutout: false,
    theme: false,
    general: false,
    about: false
  };
  @ViewChild(RadSideDrawerComponent) public drawerComponent: RadSideDrawerComponent;
  private _sideDrawerTransition: DrawerTransitionBase;
  
  constructor(private logger: LogService, private pluginService: TNSFontIconService, private player: PlayerService, private couchbase: CouchbaseService, private playlistService: PlaylistService, @Inject(Page) private _page: Page, private _changeDetectionRef: ChangeDetectorRef, private _router: Router, public authService: AuthService, public drawerService: DrawerService) {
    ActionBarUtil.STATUSBAR_STYLE(1);
    this._page.on("loaded", this.onLoaded, this);
  }

  public navItem(type: string) {
    let isChange = true;
    for (let key in this.activeRoute) {
      if (this.activeRoute[key]) {
        if (key == 'search' && type == '' || key == type) {
          // clicked on active item
          isChange = false;
        }
      }
      this.activeRoute[key] = false;
    }
    if (type == '') {
      this.activeRoute.search = true;
    } else {
      this.activeRoute[type] = true;
    }
    this.activeRoute = Object.assign({}, this.activeRoute);
    if (isChange && type !== '') {
      this._router.navigate([`/${type}`]);  
    } else {
      this.drawerService.toggle(false);
    }
  }

  public get sideDrawerTransition(): DrawerTransitionBase {
    return this._sideDrawerTransition;
  }

  public onLoaded(args) {
    this._sideDrawerTransition = new SlideInOnTopTransition();
  }

  ngAfterViewInit() {
    this.drawerService.drawer = this.drawerComponent.sideDrawer;
    this._changeDetectionRef.detectChanges();
  }
}