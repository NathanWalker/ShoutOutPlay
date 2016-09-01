import {ChangeDetectionStrategy} from '@angular/core';
import {ModalDialogParams} from "nativescript-angular/directives/dialogs";

// app
import {BaseComponent} from '../../shared/core/index';

@BaseComponent({
  // moduleId: module.id,
  selector: 'overview-video',
  templateUrl: './components/settings/video.component.html',
  changeDetection: ChangeDetectionStrategy.Default
})
export class VideoComponent {

  constructor(private params: ModalDialogParams) {

  } 
  
  public close() {
    this.params.closeCallback();
  }
}