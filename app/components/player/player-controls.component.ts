import {ElementRef, Input, Output, OnInit, ViewChild, AfterViewInit, EventEmitter} from '@angular/core';

import {BaseComponent, Config, LogService} from '../../shared/core/index';
import {TrackControlService} from '../../shared/shoutoutplay/index';

@BaseComponent({
  // moduleId: module.id,
  selector: 'player-controls',
  templateUrl: './components/player/player-controls.component.html'
})
export class PlayerControlsComponent {
  @Input() public currentTrack: any;
  @Output() public expand: EventEmitter<any> = new EventEmitter();

  constructor(private logger: LogService, public trackControl: TrackControlService) {
  }

  public maximize() {
    this.logger.debug('maximize');
    this.expand.emit(true);
  }

  public onSwipe(e: any) {
    this.logger.debug(`Swipe Direction: ${e.direction}`);
    if (e.direction==4) {
      this.maximize();
    }
  }
}