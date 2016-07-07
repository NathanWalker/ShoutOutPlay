import {OnDestroy} from '@angular/core';

// libs
import {Store} from '@ngrx/store';
import {ModalDialogParams} from "nativescript-angular/directives/dialogs";
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/take';

// app
import {LogService, BaseComponent} from '../../shared/core/index';
import {TrackModel, PlaylistModel, CouchbaseStateI} from '../../shared/shoutoutplay/index';

@BaseComponent({
  moduleId: module.id,
  selector: 'track-chooser',
  templateUrl: `track-chooser.component.html`
})
export class TrackChooserComponent implements OnDestroy {
  public tracks$: BehaviorSubject<Array<TrackModel>> = new BehaviorSubject([]);
  public noTracks: boolean = false;
  private _tracks: Array<TrackModel> = [];
  
  constructor(private store: Store<any>, private logger: LogService, private params: ModalDialogParams) {
    store.take(1).subscribe((state: any) => {
      this.initTracks(state.couchbase.playlists);
    });
  } 

  public close(track?: TrackModel) {
    this.params.closeCallback(track);
  }

  public choose(e: any) {
    this.close(this._tracks[e.index]);
  }

  private initTracks(playlists: Array<PlaylistModel>) {
    for (let playlist of playlists) {
      // only show tracks that have no shoutout attached yet
      let availableTracks = playlist.tracks.filter((track: TrackModel) => {
        return !track.shoutoutId;
      });
      for (let track of availableTracks) {
        // maintain ref of playlist that the track is part of
        track.playlistId = playlist.id;
      }
      this._tracks = [...this._tracks, ...availableTracks];
    }
    if (this._tracks.length === 0) {
      this.noTracks = true;
    } else {
      this.tracks$.next(this._tracks);
    }
  }

  ngOnDestroy() {

  }
}