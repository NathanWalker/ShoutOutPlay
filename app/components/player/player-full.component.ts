import {ElementRef, OnInit, ViewChild, AfterViewInit, ChangeDetectionStrategy} from '@angular/core';
import {Location} from '@angular/common';

// libs
import {ModalDialogParams} from "nativescript-angular/directives/dialogs";
import {Subscription} from 'rxjs/Subscription';

import {BaseComponent, Config, LogService} from '../../shared/core/index';
import {IPlayerState, TrackControlService} from '../../shared/shoutoutplay/index';

@BaseComponent({
  // moduleId: module.id,
  selector: 'player-full',
  templateUrl: './components/player/player-full.component.html',
  changeDetection: ChangeDetectionStrategy.Default
})
export class PlayerFullComponent {
  public currentTrack: any;
  public albumArtUrl: string;
  private _sub: Subscription;
  private _sub2: Subscription;

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

  ngOnInit() {
    this.logger.debug('PlayerFullComponent ngOnInit');
    this._sub = this.trackControl.player.currentTrack$.subscribe((currentTrack: any) => {
      this.currentTrack = currentTrack;
    });
    this._sub2 = this.trackControl.player.albumArtUrl$.subscribe((url: string) => {
      this.albumArtUrl = url;
    });
  }

  ngOnDestroy() {
    this.logger.debug('PlayerFullComponent ngOnDestroy');
    if (this._sub) this._sub.unsubscribe();
    if (this._sub2) this._sub2.unsubscribe();
  }
}