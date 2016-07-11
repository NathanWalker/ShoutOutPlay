import {NgZone} from '@angular/core';
import {Router} from '@angular/router';
import {Location} from '@angular/common';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

// nativescript
import {TNSSpotifyConstants, TNSSpotifyAuth} from 'nativescript-spotify';

// app
import {LogService, BaseComponent, DrawerService} from '../../shared/core/index';
import {COUCHBASE_ACTIONS} from '../../shared/shoutoutplay/index';

@BaseComponent({
  moduleId: module.id,
  selector: 'settings-general',
  templateUrl: `general.component.html`
})
export class GeneralComponent {
  public displayName$: BehaviorSubject<string> = new BehaviorSubject('');

  constructor(private logger: LogService, private ngZone: NgZone, private router: Router, private drawerService: DrawerService, private loc: Location) {
    if (TNSSpotifyAuth.SESSION) {
      TNSSpotifyAuth.CURRENT_USER().then((user: any) => {
        this.ngZone.run(() => {
          this.logger.debug(`Current user: ${user.displayName}`);
          if (user.displayName) {
            this.displayName$.next(user.displayName);
          } else {
            this.displayName$.next(`Non-premium user`);
          }
          
        });
      });
    }
  }  

  public logout() {
    TNSSpotifyAuth.LOGOUT();
    setTimeout(() => {
      // this.router.navigate([`/`]); 
      this.loc.back(); 
      this.drawerService.toggle(false);
    }, 400);
  }
}