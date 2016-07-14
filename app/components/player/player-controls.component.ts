import {ElementRef, OnInit, ViewChild, AfterViewInit} from '@angular/core';
import {Location} from '@angular/common';

// libs
import {Store} from '@ngrx/store';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/take';
import {device, screen} from 'platform';

import {BaseComponent, CoreConfigService, LogService} from '../../shared/core/index';
import {PlayerStateI, TrackModel} from '../../shared/shoutoutplay/index';

@BaseComponent({
  moduleId: module.id,
  selector: 'player-controls',
  templateUrl: `player-controls.component.html`,
  styleUrls: [`player-controls.component.css`]
})
export class PlayerControlsComponent implements OnInit, AfterViewInit {
  public minimized$: BehaviorSubject<boolean> = new BehaviorSubject(true);
  // public minimized: boolean = true;
  public playingIcon$: BehaviorSubject<string> = new BehaviorSubject('fa-play-circle');
  public currentTrack: TrackModel = new TrackModel({
    name: 'test',                                                             
    artist: {
      name: 'artist'
    }
  }); 

  constructor(public store: Store<any>, private logger: LogService) {
  }

  public togglePlay() {
    this.logger.debug(`togglePlay`);
  }

  public minimize() {
    this.logger.debug(`minimize`);
  }

  ngOnInit() {
    this.logger.debug(`PlayerControlsComponent ngOnInit`);
    this.store.select('player').subscribe((state: PlayerStateI) => {
      this.playingIcon$.next(state.playing ? 'fa-pause-circle' : 'fa-play-circle');
    });
  }

  ngAfterViewInit() {

  }
}