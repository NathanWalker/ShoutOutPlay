import {Router} from '@angular/router';

// app
import {LogService, BaseComponent} from '../../shared/core/index';
import {COUCHBASE_ACTIONS} from '../../shared/shoutoutplay/index';

@BaseComponent({
  moduleId: module.id,
  selector: 'settings-help',
  templateUrl: `help.component.html`
})
export class HelpComponent {

  constructor(private router: Router) {

  }  

  public viewIntro() {
    this.router.navigate(['/intro']);
  }
}