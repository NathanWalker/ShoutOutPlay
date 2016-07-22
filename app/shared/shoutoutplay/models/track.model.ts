// libs
import {TNSTrack} from 'nativescript-spotify';

// TODO: modify spotify plugin to return custom object for album/artist with only these properties  
// only identifier and name are strings... others are platform specific data types like NSArray, NSURL etc.
const supportedAnyKeys = ['identifier', 'name']; //'uri', 'playableUri', 'sharingURL', 'covers', 'smallestCover', 'largestCover', 'type'];

export class TrackModel {
  public id: string; // spotify track id
  public name: string;
  public artist: any;
  public album: any;
  public duration: number;
  public shoutoutId: string;
  public playlistId: string;
  public playing: boolean;
  public order: number;
  
  constructor(track: any) {
    if (track) {
      for (let key in track) {
        if (track.hasOwnProperty(key)) {
          if (key === 'album' || key === 'artist') {
            this[key] = {};
            for (let supportedKey of supportedAnyKeys) {
              if (supportedKey === 'identifier') {
                this[key].id = track[key][supportedKey];
              } else {
                this[key][supportedKey] = track[key][supportedKey];
              }
            }
          } else {
            this[key] = track[key];    
          }
        }
      }
      if (!this.order) {
        this.order = 0;
      }
    }
  }
}