// angular
import {ChangeDetectionStrategy, ChangeDetectorRef, ViewChild, AfterViewInit, ElementRef, OnInit, NgZone} from '@angular/core';
import {Router} from '@angular/router';

// nativescript
import {Page} from "ui/page";
import {screen, isIOS} from 'platform';

/* register elements */
import {registerElement} from "nativescript-angular/element-registry"
registerElement("Slide", () => require("nativescript-slides").Slide);
registerElement("SlideContainer", () => require("nativescript-slides").SlideContainer);
registerElement("Gif", () => require("nativescript-gif").Gif);
if (isIOS) {
  registerElement("AudioPlot", () => require("nativescript-ezaudio").AudioPlot);
} 

// libs
import {TNSFontIconService} from 'nativescript-ng2-fonticon';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

// app
import {ActionBarUtil, BaseComponent} from './shared/core/index';//LogService, DrawerService
// import {AuthService, PlayerService, FirebaseService, PlaylistService} from './shared/shoutoutplay/index';
 
@BaseComponent({
  // moduleId: module.id,
  selector: 'my-app',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.Default
}) 
export class AppComponent {
  
  // constructor(private logger: LogService, private pluginService: TNSFontIconService, private player: PlayerService, private firebaseService: FirebaseService, private playlistService: PlaylistService, @Inject(Page) private _page: Page, private _changeDetectionRef: ChangeDetectorRef, private router: Router, public authService: AuthService, public drawerService: DrawerService, private ngZone: NgZone) {
  //   ActionBarUtil.STATUSBAR_STYLE(1);
  // }

  constructor(private pluginService: TNSFontIconService) {
    ActionBarUtil.STATUSBAR_STYLE(1);
  }
}