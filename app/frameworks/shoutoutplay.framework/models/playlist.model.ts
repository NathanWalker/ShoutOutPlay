// libs
import {TrackModel} from './track.model';
import * as _ from 'lodash';

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
          // couchbase id
          this.id = model[key];
        } else {
          this[key] = model[key];  
        }
      }
    }
  }
  
  public addTrack(track: TrackModel): boolean {
    if (!this.tracks) {
      this.tracks = [];
    }
    let dup = _.find(this.tracks, { id: track.id });
    if (dup) {
      return false;
    } else {
      this.tracks.push(track);
      return true;
    }
  }
}