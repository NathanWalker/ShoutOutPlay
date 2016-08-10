// angular
import {ChangeDetectionStrategy, ChangeDetectorRef, Inject, ViewChild, AfterViewInit, ElementRef, OnInit, NgZone} from '@angular/core';
import {Router} from '@angular/router';

// nativescript
import {NS_ROUTER_DIRECTIVES, nsProvideRouter} from 'nativescript-angular/router';
import {RadSideDrawerComponent} from 'nativescript-telerik-ui-pro/sidedrawer/angular';
import {PushTransition, DrawerTransitionBase, SlideInOnTopTransition} from 'nativescript-telerik-ui-pro/sidedrawer';
import {Page} from "ui/page";
import {screen, isIOS} from 'platform';
import {AbsoluteLayout} from 'ui/layouts/absolute-layout';

/* register elements */
import {registerElement} from "nativescript-angular/element-registry"
registerElement("CardView", () => require("nativescript-cardview").CardView);
registerElement("Slide", () => require("nativescript-slides").Slide);
registerElement("SlideContainer", () => require("nativescript-slides").SlideContainer);
registerElement("Gif", () => require("nativescript-gif").Gif);
if (isIOS) {
  registerElement("AudioPlot", () => require("nativescript-ezaudio").AudioPlot);
} 

// libs
import {TNSFontIconService} from 'nativescript-ng2-fonticon/nativescript-ng2-fonticon';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

// app
import {PlayerControlsComponent} from './components/player/player-controls.component';
import {ActionBarUtil, BaseComponent, LogService, DrawerService} from './shared/core/index';
import {AuthService, PlayerService, FirebaseService, PlaylistService} from './shared/shoutoutplay/index';
 
// @BaseComponent({
//   selector: 'main-view',
//   template: `
//   <AbsoluteLayout class="page-bg">
//       <page-router-outlet class="page-bg" top="0" left="0" width="100%" height="100%"></page-router-outlet>
//       <player-controls #playerControls top="50" left="0" width="100%" height="50"></player-controls>
//   </AbsoluteLayout>
//   `,
//   directives: [PlayerControlsComponent]
// })
// class MainViewComponent {

// }  

@BaseComponent({
  // moduleId: module.id,
  selector: 'my-app',
  templateUrl: './app.component.html',
  // directives: [MainViewComponent],
  changeDetection: ChangeDetectionStrategy.Default
}) 
export class AppComponent implements AfterViewInit {
  public activeRoute: any = {
    search: true,
    playlist: false,
    shoutout: false,
    theme: false,
    general: false,
    help: false,
    about: false
  };
  @ViewChild(RadSideDrawerComponent) public drawerComponent: RadSideDrawerComponent;
  // @ViewChild(PlayerControlsComponent) public playerControlsComponent: PlayerControlsComponent;
  private _sideDrawerTransition: DrawerTransitionBase;
  // private _playerControls: any;
  
  constructor(private logger: LogService, private pluginService: TNSFontIconService, private player: PlayerService, private firebaseService: FirebaseService, private playlistService: PlaylistService, @Inject(Page) private _page: Page, private _changeDetectionRef: ChangeDetectorRef, private router: Router, public authService: AuthService, public drawerService: DrawerService, private ngZone: NgZone) {
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
      this.router.navigate([`/${type}`]);  
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

    // this.logger.debug(`this.playerControlsComponent:`);
    // this.logger.debug(this.playerControlsComponent);

    // this.logger.debug(this.playerControlsComponent.nativeElement);


    // setTimeout(() => {
    //   this.logger.debug(`Dimensions: ${screen.mainScreen.widthDIPs}x${screen.mainScreen.heightDIPs}`);
    //   // this.logger.debug(this.drawerService.drawer.mainContent);
    //   // this._playerControls = this.drawerService.drawer.mainContent.getViewById('playerControls');

    //   // this.logger.debug(`this._playerControls:`);
    //   // this.logger.debug(this._playerControls);
    //   // this.logger.debug(this._playerControls.top);

    //   // AbsoluteLayout.setTop(this._playerControls, 360);
    //   // this.logger.debug(this._playerControls.top);
    // }, 1000);
  }
}