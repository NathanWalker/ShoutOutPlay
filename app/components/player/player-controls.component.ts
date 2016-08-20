import {ElementRef, OnInit, ViewChild, AfterViewInit} from '@angular/core';
import {Location} from '@angular/common';

// libs
import {Store} from '@ngrx/store';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Subscription} from 'rxjs/Subscription';
import 'rxjs/add/operator/take';
import {device, screen} from 'platform';

import {BaseComponent, Config, LogService} from '../../shared/core/index';
import {IPlayerState, TrackModel} from '../../shared/shoutoutplay/index';

@BaseComponent({
  // moduleId: module.id,
  selector: 'player-controls',
  templateUrl: './components/player/player-controls.component.html'
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
  private _sub: Subscription;

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
    this._sub = this.store.select('player').subscribe((state: IPlayerState) => {
      this.playingIcon$.next(state.playing ? 'fa-pause-circle' : 'fa-play-circle');
    });
  }

  ngAfterViewInit() {

  }

  ngOnDestroy() {
    if (this._sub) {
      this._sub.unsubscribe();
    }
    
  }
}