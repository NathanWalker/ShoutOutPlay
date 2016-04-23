// libs
import {TrackModel} from './track.model';

export class PlaylistModel {
  public id: string;
  public name: string;
  public tracks: Array<TrackModel> = [];
  public playing: boolean = false;
  public type: string = 'playlist';
  
  constructor(model?: any) {
    if (model) {
      for (let key in model) {
        if (key === '_id') {
          this.id = model[key];
        } else {
          this[key] = model[key];  
        }
      }
    }
    if (!this.id) {
      // couchbase id's are strings
      this.id = Math.floor(Math.random()*100000000000000000).toString();  
    }
  }
  
  public addTrack(track: TrackModel) {
    if (!this.tracks) {
      this.tracks = [];
    }
    this.tracks.push(track);
  }
}