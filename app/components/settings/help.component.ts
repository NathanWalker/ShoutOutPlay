import {Router} from '@angular/router';

// app
import {LogService, BaseComponent, DrawerService} from '../../shared/core/index';
import {FIREBASE_ACTIONS} from '../../shared/shoutoutplay/index';

@BaseComponent({
  // moduleId: module.id,
  selector: 'settings-help',
  templateUrl: './components/settings/help.component.html'
})
export class HelpComponent {

  constructor(public drawerService: DrawerService, private router: Router) {

  }  

  public viewIntro() {
    this.router.navigate(['/intro']);
  }
}