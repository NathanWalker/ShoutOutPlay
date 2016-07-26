// libs
import {TrackModel} from './track.model';
import * as _ from 'lodash';

export class PlaylistModel {
  public id: string;
  public name: string;
  public tracks: Array<TrackModel> = [];
  public playing: boolean = false;
  public spotifyUri: string;
  public type: string = 'playlist';
  public order: number;
  
  constructor(model?: any) {
    if (model) {
      if (model.id) 
        this.id = model.id;
      if (model.uri)
        this.spotifyUri = model.uri;
      
      for (let key in model) {
        if (key !== 'id' && key !== 'uri') {
          if (key === 'tracks') {
            if (this.spotifyUri) {
              // from spotify
              for (let i = 0; i < model.tracks.length; i++) {
                let track = model.tracks[i];
                track = new TrackModel(track);
                track.playlistId = this.id || model.id;
                this.tracks.push(track);
                this.order = i;
              }
            } else {
              // from firebase
              for (let firebaseTrackId in model.tracks) {   
                let track = new TrackModel(model.tracks[firebaseTrackId]);
                track.playlistId = this.id || model.id;
                this.tracks.push(track);
              }
            }
          } else {
            this[key] = model[key];  
          }
        }
      }
      if (!this.order) {
        this.order = 0;
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
      // ensure track state is reset since this gets persisted after adding the track
      if (this.id) {
        track.playlistId = this.id;
      }
      track.order = this.tracks.length;
      track.playing = false;
      this.tracks.push(track);
      return true;
    }
  }

  public removeTrack(track: TrackModel): void {
    if (track) {
      let index = -1;
      for (let i = 0; i < this.tracks.length; i++) {
        if (this.tracks[i].id === track.id) {
          index = i;
          break;
        }
      }
      if (index > -1) {
        this.tracks.splice(index, 1);
      }
    }
  }
}