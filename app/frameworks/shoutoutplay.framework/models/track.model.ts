// libs
import {TNSTrack} from 'nativescript-spotify';

export class TrackModel implements TNSTrack {
  public id: string;
  public name: string;
  public artist: any;
  public duration: number;
  public playableUri: string;
  public previewUrl: string;
  public album: any;
  public shoutoutId: number;
  
  constructor(track: any, shoutoutId?: number) {
    if (track) {
      for (let key in track) {
        this[key] = track[key];
      }
    }
    if (shoutoutId) {
      this.shoutoutId = shoutoutId;
    }
  }
}