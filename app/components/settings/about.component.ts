import * as utils from 'utils/utils';

// app
import {LogService, BaseComponent} from '../../shared/core/index';

@BaseComponent({
  // moduleId: module.id,
  selector: 'settings-about',
  templateUrl: './components/settings/about.component.html'
})
export class AboutComponent {

  public viewPage() {
    utils.openUrl('https://www.nativescript.org/nativescript-is-how-you-build-native-mobile-apps-with-angular');
  }

  public viewGH() {
    utils.openUrl('https://github.com/NathanWalker');
  }

  public emailNA() {
    utils.openUrl('https://github.com/nathanaela');
  }

  public viewPlugin(target: number) {
    switch (target) {
      case 1:
        utils.openUrl('https://github.com/NathanWalker/nativescript-spotify');
        break;
      case 2:
        utils.openUrl('https://github.com/NathanWalker/nativescript-ezaudio');
        break;
      case 3:
        utils.openUrl('https://github.com/NathanWalker/nativescript-fancyalert');
        break;
      case 4:
        utils.openUrl('https://github.com/bradmartin/nativescript-gif');
        break;
      case 5:
        utils.openUrl('https://github.com/pocketsmith/nativescript-loading-indicator');
        break;
      case 6:
        utils.openUrl('https://github.com/NathanWalker/nativescript-ng2-fonticon');
        break;
      case 7:
        utils.openUrl('https://github.com/EddyVerbruggen/nativescript-plugin-firebase');
        break;
      case 8:
        utils.openUrl('https://github.com/TheOriginalJosh/nativescript-slides');
        break;
      case 9:
        utils.openUrl('https://github.com/triniwiz/nativescript-splashscreen');
        break;
      case 10:
        utils.openUrl('http://www.telerik.com/nativescript-ui');
        break;
      case 11:
        utils.openUrl('https://github.com/NathanaelA/nativescript-themes');
        break;
      case 12:
        utils.openUrl('https://github.com/NathanaelA/nativescript-master-technology');
        break;
      case 13:
        utils.openUrl('https://github.com/bradmartin/nativescript-audio');
        break;
      case 14:
        utils.openUrl('https://github.com/NathanaelA/nativescript-permissions');
        break;
      case 15:
        utils.openUrl('https://github.com/NathanWalker/nativescript-coachmarks');
        break;
      case 16:
        utils.openUrl('https://github.com/toddanglin/nativescript-dev-sass');
        break;
      case 17:
        utils.openUrl('https://github.com/tjvantoll/nativescript-social-share');
        break;
    }
  }
}