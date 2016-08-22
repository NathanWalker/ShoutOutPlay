import {ElementRef, OnInit, ViewChild, AfterViewInit, ChangeDetectionStrategy} from '@angular/core';
import {Location} from '@angular/common';

// libs
import {ModalDialogParams} from "nativescript-angular/directives/dialogs";

import {BaseComponent, Config, LogService} from '../../shared/core/index';
import {IPlayerState, TrackControlService} from '../../shared/shoutoutplay/index';

@BaseComponent({
  // moduleId: module.id,
  selector: 'player-full',
  templateUrl: './components/player/player-full.component.html',
  changeDetection: ChangeDetectionStrategy.Default
})
export class PlayerFullComponent {

  constructor(private logger: LogService, private params: ModalDialogParams, public trackControl: TrackControlService) {
  }

  public close() {
    this.logger.debug('close');
    this.params.closeCallback();
  }
}