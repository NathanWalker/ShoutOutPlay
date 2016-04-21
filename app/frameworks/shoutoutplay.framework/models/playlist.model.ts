// libs
import {TrackModel} from './track.model';

export class PlaylistModel {
  public id: number;
  public name: string;
  public tracks: Array<TrackModel>;
  
  constructor(name?: string, tracks?: Array<TrackModel>, id?: number) {
    this.id = id || Math.floor(Math.random()*100000000000000000);
    if (name) {
      this.name = name;
    }
    if (tracks) {
      this.tracks = tracks;
    }
  }
  
  public addTrack(track: TrackModel) {
    if (!this.tracks) {
      this.tracks = [];
    }
    this.tracks.push(track);
  }
}