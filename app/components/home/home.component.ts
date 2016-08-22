import {ChangeDetectionStrategy, ViewChild, ElementRef, AfterViewInit, ChangeDetectorRef, Inject, OnInit} from '@angular/core';
import {Router, NavigationEnd} from '@angular/router';

// app
import {BaseComponent, Config, LogService, ActionBarUtil, DrawerService} from '../../shared/core/index';
import {AuthService, PlayerService, IPlayerState, FirebaseService, PlaylistService} from '../../shared/shoutoutplay/index';
import {PlayerControlsComponent} from '../player/player-controls.component';
import {PlayerFullComponent} from '../player/player-full.component';

// nativescript
import {NS_ROUTER_DIRECTIVES, nsProvideRouter} from 'nativescript-angular/router';
import {ModalDialogService, ModalDialogHost, ModalDialogOptions} from "nativescript-angular/directives/dialogs";
import {RadSideDrawerComponent} from 'nativescript-telerik-ui-pro/sidedrawer/angular';
import {PushTransition, DrawerTransitionBase, SlideInOnTopTransition} from 'nativescript-telerik-ui-pro/sidedrawer';
import {Page} from "ui/page";
import {screen} from 'platform';

// libs
import {TNSFontIconService} from 'nativescript-ng2-fonticon';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Subscription} from 'rxjs/Subscription';


declare var zonedCallback: Function;

@BaseComponent({
  // moduleId: module.id,
  selector: 'home',
  templateUrl: './components/home/home.component.html',
  directives: [ModalDialogHost, PlayerControlsComponent],
  providers: [ModalDialogService],
  changeDetection: ChangeDetectionStrategy.Default
})
export class HomeComponent implements AfterViewInit, OnInit {
  // @ViewChild('playerControls') playerControls: PlayerControlsComponent;
  // private _playerControls: any;
  public showControls$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  @ViewChild(RadSideDrawerComponent) public drawerComponent: RadSideDrawerComponent;
  private _sideDrawerTransition: DrawerTransitionBase;
  private _playerControls: any;
  private _sub: Subscription;
  
  constructor(private logger: LogService, private pluginService: TNSFontIconService, private player: PlayerService, private firebaseService: FirebaseService, private playlistService: PlaylistService, @Inject(Page) private _page: Page, private _changeDetectionRef: ChangeDetectorRef, private router: Router, public authService: AuthService, public drawerService: DrawerService, private modal: ModalDialogService) {
    ActionBarUtil.STATUSBAR_STYLE(1);
    this._page.on("loaded", this.onLoaded, this);
  }

  public get sideDrawerTransition(): DrawerTransitionBase {
    return this._sideDrawerTransition;
  }

  public onLoaded(args) {
    this._sideDrawerTransition = new SlideInOnTopTransition();
  }

  public openFullPlayer() {
    let options: ModalDialogOptions = {
      context: { },
      fullscreen: true
    };
    this.modal.showModal(PlayerFullComponent, options).then(zonedCallback(() => {
      
    }));
  }

  ngOnInit() {
    this.logger.debug(`HomeComponent ngOnInit`);
    this.router.events.subscribe((e) => {
      if (e instanceof NavigationEnd) {
        this.drawerService.toggle(false);  
      }
    });

    this._sub = this.player.state$.subscribe((state: IPlayerState) => {
      let showControls = state.currentTrackId || state.previewTrackId ? true : false;
      this.showControls$.next(showControls);
      this.logger.debug(`showControls: ${showControls}`);
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
  }

  ngOnDestroy() {
    if (this._sub) {
      this._sub.unsubscribe();
    }
  }
}