import {NgZone, ViewChild, ElementRef, AfterViewInit} from '@angular/core';
import {Router} from '@angular/router';
import {Location} from '@angular/common';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

// nativescript
import {TNSSpotifyConstants, TNSSpotifyAuth} from 'nativescript-spotify';
import {Observable} from 'data/observable';

// libs
import {debounce} from 'lodash';

// app
import {CoreConfigService, LogService, BaseComponent, DrawerService} from '../../shared/core/index';
import {COUCHBASE_ACTIONS, PlayerService} from '../../shared/shoutoutplay/index';

@BaseComponent({
  moduleId: module.id,
  selector: 'settings-general',
  templateUrl: `general.component.html`
})
export class GeneralComponent implements AfterViewInit {
  @ViewChild('slider') public slider: ElementRef;
  public displayName$: BehaviorSubject<string> = new BehaviorSubject('');
  public emailAddress$: BehaviorSubject<string> = new BehaviorSubject('');
  public shoutoutTime: number = 6;
  public shoutoutTime$: BehaviorSubject<string> = new BehaviorSubject(`6 seconds`);

  constructor(private logger: LogService, private ngZone: NgZone, private router: Router, private drawerService: DrawerService, private loc: Location) {
    if (TNSSpotifyAuth.SESSION) {
      TNSSpotifyAuth.CURRENT_USER().then((user: any) => {
        this.ngZone.run(() => {
          this.logger.debug(`Current user: ${user.displayName}`);
          if (user.displayName) {
            this.displayName$.next(user.displayName);
            this.emailAddress$.next(user.emailAddress);
          } else {
            this.displayName$.next(`Non-premium user`);
          }
          
        });
      });
    }
    let start = CoreConfigService.SHOUTOUT_START_TIME();
    this.shoutoutTime = start/1000;
    this.shoutoutTime$.next(`${this.shoutoutTime} seconds`);
  }  

  public logout() {
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
      CoreConfigService.SET_SHOUTOUT_START_TIME(newTime);
      PlayerService.SHOUTOUT_START = newTime;
      this.shoutoutTime$.next(`${rawValue} seconds`);
    });
  }

  ngAfterViewInit() {
    let debouncedSlider = debounce(this.setStartOutTime.bind(this), 400);
    this.slider.nativeElement.on(Observable.propertyChangeEvent, debouncedSlider.bind(this));
  }
}