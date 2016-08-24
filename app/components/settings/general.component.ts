import {NgZone, ViewChild, ElementRef, AfterViewInit, ChangeDetectionStrategy} from '@angular/core';
import {Router} from '@angular/router';
import {Location} from '@angular/common';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

// nativescript
import {TNSSpotifyConstants, TNSSpotifyAuth} from 'nativescript-spotify';
import {Observable} from 'data/observable';

// libs
import {Store} from '@ngrx/store';
import {debounce} from 'lodash';

// app
import {Config, LogService, BaseComponent, DrawerService, FancyAlertService} from '../../shared/core/index';
import {FIREBASE_ACTIONS, PlayerService, ShoutoutService} from '../../shared/shoutoutplay/index';

@BaseComponent({
  // moduleId: module.id,
  selector: 'settings-general',
  templateUrl: './components/settings/general.component.html',
  changeDetection: ChangeDetectionStrategy.Default
})
export class GeneralComponent implements AfterViewInit {
  @ViewChild('slider') public slider: ElementRef;
  @ViewChild('switch1') public switch1: ElementRef;
  public displayName$: BehaviorSubject<string> = new BehaviorSubject('Loading...');
  public emailAddress$: BehaviorSubject<string> = new BehaviorSubject('...');
  public shoutoutTime: number = 6;
  public shoutoutTime$: BehaviorSubject<string> = new BehaviorSubject(`6 seconds`);
  public shoutoutAskName: boolean;

  constructor(private logger: LogService, private store: Store<any>, private ngZone: NgZone, private router: Router, private drawerService: DrawerService, private loc: Location, private fancyalert: FancyAlertService, private shoutoutService: ShoutoutService) {
    if (TNSSpotifyAuth.SESSION) {
      TNSSpotifyAuth.CURRENT_USER().then((user: any) => {
        this.ngZone.run(() => {
          this.logger.debug(`Current user: ${user.displayName}`);
          if (user.displayName) {
            this.displayName$.next(user.displayName);
            this.emailAddress$.next(user.emailAddress);
          } else {
            this.displayName$.next(`Non-premium user`);
            this.emailAddress$.next('');
          }
          
        });
      }, () => {
        this.ngZone.run(() => {
          this.displayName$.next(`N/A`);
          this.emailAddress$.next('');
        });
      });
    }
    let start = Config.SHOUTOUT_START_TIME();
    this.shoutoutTime = start/1000;
    this.shoutoutTime$.next(`${this.shoutoutTime} seconds`);
    this.shoutoutAskName = Config.SHOUTOUT_ASK_NAME();
  }  

  public toggleAskName() {
    this.ngZone.run(() => {
      this.shoutoutAskName = !this.shoutoutAskName;
      this.logger.debug(`toggle ask name: ${this.shoutoutAskName}`);
      Config.SET_SHOUTOUT_ASK_NAME(this.shoutoutAskName);
    });
  }

  public removeConfirm() {
    this.fancyalert.confirm('Are you sure you want to reset your account? This will clear all playlists and shoutouts. Upon logging out and back into Spotify, your playlists will be restored to the latest changes on Spotify.', 'warning', () => {
      this.store.dispatch({ type: FIREBASE_ACTIONS.RESET_ACCOUNT });
    });
  }

  public logout() {
    TNSSpotifyAuth.CLEAR_COOKIES = true;
    TNSSpotifyAuth.LOGOUT();
    setTimeout(() => {
      // this.router.navigate([`/`]); 
      this.loc.back(); 
      this.drawerService.toggle(false);
    }, 400);
  }

  private setStartOutTime() {
    this.ngZone.run(() => {
      let rawValue = Math.floor(this.shoutoutTime);
      this.logger.debug(`setStartOutTime: ${rawValue}`);
      let newTime = rawValue * 1000;
      Config.SET_SHOUTOUT_START_TIME(newTime);
      PlayerService.SHOUTOUT_START = newTime;
      this.shoutoutTime$.next(`${rawValue} seconds`);
    });
  }

  ngAfterViewInit() {
    let debouncedSlider = debounce(this.setStartOutTime.bind(this), 400);
    this.slider.nativeElement.on(Observable.propertyChangeEvent, debouncedSlider.bind(this));
    this.switch1.nativeElement.on(Observable.propertyChangeEvent, this.toggleAskName.bind(this));
  }
}