import {Router} from '@angular/router';

// nativescript
import {ModalDialogService, ModalDialogHost, ModalDialogOptions} from "nativescript-angular/directives/dialogs";

// app
import {LogService, BaseComponent} from '../../shared/core/index';
import {FIREBASE_ACTIONS} from '../../shared/shoutoutplay/index';
import {VideoComponent} from './video.component';

@BaseComponent({
  // moduleId: module.id,
  selector: 'settings-help',
  templateUrl: './components/settings/help.component.html'
})
export class HelpComponent {

  constructor(private router: Router, private modal: ModalDialogService) {

  }  

  public viewOverview() {
    let options: ModalDialogOptions = {
      context: { promptMsg: '' },
      fullscreen: false
    };
    this.modal.showModal(VideoComponent, options).then((res: string) => {
      
    });
  }

  public viewIntro() {
    this.router.navigate(['/intro']);
  }
}