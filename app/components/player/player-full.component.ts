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

  public navToTrack() {
    let currentTrack = this.trackControl.player.currentTrack$.getValue();
    this.logger.debug(currentTrack);
    for (let key in currentTrack) {
      this.logger.debug(`key: ${key}, ${currentTrack[key]}`);
    }
  }

  public onSwipe(e: any) {
    this.logger.debug(`Swipe Direction: ${e.direction}`);
    if (e.direction==8) {
      this.close();
    }
  }
}