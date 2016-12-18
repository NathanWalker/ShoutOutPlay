import { ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';

// nativescript
import {ModalDialogService, ModalDialogOptions} from "nativescript-angular";

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

  constructor(private router: Router, private modal: ModalDialogService, private vcRef: ViewContainerRef) {

  }  

  public viewOverview() {
    let options: ModalDialogOptions = {
      context: { promptMsg: '' },
      fullscreen: false,
      viewContainerRef: this.vcRef
    };
    this.modal.showModal(VideoComponent, options).then((res: string) => {
      
    });
  }

  public viewIntro() {
    this.router.navigate(['/intro']);
  }
}