// angular
import {Component} from '@angular/core';

// libs
import {Store} from '@ngrx/store';
import {ModalDialogParams} from "nativescript-angular/directives/dialogs";
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

// app
import {LogService, BaseComponent} from '../../frameworks/core.framework/index';
import {SHOUTOUT_ACTIONS, TrackModel, PlaylistModel, PlaylistStateI} from '../../frameworks/shoutoutplay.framework/index';

@Component({
  selector: 'track-chooser',
  templateUrl: `./components/record/track-chooser.component.html`,
  styleUrls: [`./components/record/track-chooser.component.css`]
})
export class TrackChooserComponent {
  public tracks$: BehaviorSubject<Array<TrackModel>> = new BehaviorSubject([]);
  private _tracks: Array<TrackModel> = [];
  
  constructor(private store: Store<any>, private logger: LogService, private params: ModalDialogParams) {
    logger.debug(`TrackChooserComponent`);
    store.select('playlist').subscribe((state: PlaylistStateI) => {
      this.initTracks(state.list);
    });
  } 

  public close(track?: TrackModel) {
    this.params.closeCallback(track);
  }

  public choose(e: any) {
    this.close(this._tracks[e.index]);
  }

  private initTracks(list: Array<PlaylistModel>) {
    for (let playlist of list) {
      this._tracks = [...this._tracks, ...playlist.tracks];
    }
    console.log(this._tracks.length);
    setTimeout(() => {
      this.tracks$.next(this._tracks);
    });
    
  }
}