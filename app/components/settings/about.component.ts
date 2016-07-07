import * as utils from 'utils/utils';

// app
import {LogService, BaseComponent} from '../../frameworks/core.framework/index';

@BaseComponent({
  moduleId: module.id,
  selector: 'settings-about',
  templateUrl: `about.component.html`
})
export class AboutComponent {

  public viewPage() {
    utils.openUrl('https://www.nativescript.org/nativescript-is-how-you-build-native-mobile-apps-with-angular');
  }

  public viewGH() {
    utils.openUrl('https://github.com/NathanWalker');
  }
}