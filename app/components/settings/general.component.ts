import {Router} from '@angular/router';

// app
import {LogService, BaseComponent} from '../../frameworks/core.framework/index';
import {COUCHBASE_ACTIONS} from '../../frameworks/shoutoutplay.framework/index';

@BaseComponent({
  moduleId: module.id,
  selector: 'settings-general',
  templateUrl: `general.component.html`
})
export class GeneralComponent {

  constructor(private _router: Router) {

  }  

  public viewIntro() {
    this._router.navigate(['/intro']);
  }
}