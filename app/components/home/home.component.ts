import {ChangeDetectionStrategy, ViewChild, ElementRef, AfterViewInit, ChangeDetectorRef, Inject, OnInit} from '@angular/core';
import {Router, NavigationEnd} from '@angular/router';

// app
import {BaseComponent, Config, LogService, ActionBarUtil, DrawerService} from '../../shared/core/index';
import {AuthService, PlayerService, FirebaseService, PlaylistService} from '../../shared/shoutoutplay/index';
import {PlayerControlsComponent} from '../player/player-controls.component';

// nativescript
import {NS_ROUTER_DIRECTIVES, nsProvideRouter} from 'nativescript-angular/router';
import {RadSideDrawerComponent} from 'nativescript-telerik-ui-pro/sidedrawer/angular';
import {PushTransition, DrawerTransitionBase, SlideInOnTopTransition} from 'nativescript-telerik-ui-pro/sidedrawer';
import {Page} from "ui/page";
import {screen} from 'platform';
import {AbsoluteLayout} from 'ui/layouts/absolute-layout';

// libs
import {TNSFontIconService} from 'nativescript-ng2-fonticon';

@BaseComponent({
  // moduleId: module.id,
  selector: 'home',
  templateUrl: './components/home/home.component.html',
  directives: [PlayerControlsComponent],
  changeDetection: ChangeDetectionStrategy.Default
})
export class HomeComponent implements AfterViewInit, OnInit {
  // @ViewChild('playerControls') playerControls: PlayerControlsComponent;
  // private _playerControls: any;
  
  // constructor(private logger: LogService) { }

  // ngAfterViewInit() {
  //   this.logger.debug(`HomeComponent ngAfterViewInit`);
  //   this.logger.debug(this.playerControls);
  //   // if (this.playerControls) {
  //   //   this._playerControls = this.playerControls.nativeElement;
  //   //   this.logger.debug(this._playerControls);

  //   // }
  // }


  // public activeRoute: any = {
  //   search: true,
  //   playlist: false,
  //   shoutout: false,
  //   theme: false,
  //   general: false,
  //   help: false,
  //   about: false
  // };
  @ViewChild(RadSideDrawerComponent) public drawerComponent: RadSideDrawerComponent;
  private _sideDrawerTransition: DrawerTransitionBase;
  private _playerControls: any;
  
  constructor(private logger: LogService, private pluginService: TNSFontIconService, private player: PlayerService, private firebaseService: FirebaseService, private playlistService: PlaylistService, @Inject(Page) private _page: Page, private _changeDetectionRef: ChangeDetectorRef, private router: Router, public authService: AuthService, public drawerService: DrawerService) {
    ActionBarUtil.STATUSBAR_STYLE(1);
    this._page.on("loaded", this.onLoaded, this);
  }

  // public navItem(type: string) {
  //   let isChange = true;
  //   for (let key in this.activeRoute) {
  //     if (this.activeRoute[key]) {
  //       if (key == 'search' && type == '' || key == type) {
  //         // clicked on active item
  //         isChange = false;
  //       }
  //     }
  //     this.activeRoute[key] = false;
  //   }
  //   if (type == '') {
  //     this.activeRoute.search = true;
  //   } else {
  //     this.activeRoute[type] = true;
  //   }
  //   this.activeRoute = Object.assign({}, this.activeRoute);
  //   if (isChange && type !== '') {
  //     this.router.navigate([`/home/${type}`]);  
  //   } else {
  //     this.drawerService.toggle(false);
  //   }
  // }

  public get sideDrawerTransition(): DrawerTransitionBase {
    return this._sideDrawerTransition;
  }

  public onLoaded(args) {
    this._sideDrawerTransition = new SlideInOnTopTransition();
  }

  ngOnInit() {
    this.logger.debug(`HomeComponent ngOnInit`);
    this.router.events.subscribe((e) => {
      if (e instanceof NavigationEnd) {
        this.drawerService.toggle(false);  
      }
    });

    // if (!Config.SEEN_INTRO()) {
    //   this.router.navigate(['/intro']);
    // } else {
    //   // Config.SET_SEEN_INTRO(false);
    //   // HACK: search view doesn't render when showing to start
    //   this.router.navigate(['/welcome']);
    // }  
  }

  ngAfterViewInit() {
    this.logger.debug(`HomeComponent ngAfterViewInit`);
    this.drawerService.drawer = this.drawerComponent.sideDrawer;
    this._changeDetectionRef.detectChanges();


    // setTimeout(() => {
    //   this.logger.debug(`Dimensions: ${screen.mainScreen.widthDIPs}x${screen.mainScreen.heightDIPs}`);
    //   this.logger.debug(this.drawerService.drawer.mainContent);
    //   this._playerControls = this.drawerService.drawer.mainContent.getViewById('playerControls');

    //   this.logger.debug(`this._playerControls:`);
    //   this.logger.debug(this._playerControls);
    //   this.logger.debug(this._playerControls.top);

    //   AbsoluteLayout.setTop(this._playerControls, 360);
    //   this.logger.debug(this._playerControls.top);
    // }, 1000);
  }
}