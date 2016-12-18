import {OnDestroy} from '@angular/core';

// libs
import {Store} from '@ngrx/store';
import {ModalDialogParams} from "nativescript-angular";
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/take';

// app
import {LogService, BaseComponent} from '../../shared/core/index';
import {TrackModel, PlaylistModel, IFirebaseState} from '../../shared/shoutoutplay/index';

@BaseComponent({
  // moduleId: module.id,
  selector: 'track-chooser',
  templateUrl: './components/record/track-chooser.component.html'
})
export class TrackChooserComponent implements OnDestroy {
  public tracks$: BehaviorSubject<Array<TrackModel>> = new BehaviorSubject([]);
  public noTracks: boolean = false;
  private _tracks: Array<TrackModel> = [];
  
  constructor(private store: Store<any>, private logger: LogService, private params: ModalDialogParams) {
    store.take(1).subscribe((state: any) => {
      this.initTracks(state.firebase.playlists);
    });
  } 

  public close(track?: TrackModel) {
    this.params.closeCallback(track);
  }

  public choose(e: any) {
    // this.close(this._tracks[e.index]);
    this.logger.debug(e);
    this.logger.debug(e.name);
    this.close(e);
  }

  public search(e: any) {
    if (e && e.object) {
      this.logger.debug(e.object.text);
      let filteredTracks = this._tracks.filter((t: TrackModel) => {
        return t.name.indexOf(e.object.text) > -1 || t.artist.name.indexOf(e.object.text) > -1;
      }); 
      this.tracks$.next(filteredTracks);
    }
  }

  public clear() {
    this.logger.debug('clear');
    this.tracks$.next(this._tracks);
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