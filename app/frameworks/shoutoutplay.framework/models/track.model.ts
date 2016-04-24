// libs
import {TNSTrack} from 'nativescript-spotify';

// TODO: modify spotify plugin to return custom object for album/artist with only these properties  
// only identifier and name are strings... others are platform specific data types like NSArray, NSURL etc.
const supportedAnyKeys = ['identifier', 'name']; //'uri', 'playableUri', 'sharingURL', 'covers', 'smallestCover', 'largestCover', 'type'];

export class TrackModel implements TNSTrack {
  public id: string; // spotify track id
  public name: string;
  public artist: any;
  public duration: number;
  public playableUri: string;
  public previewUrl: string;
  public album: any;
  public shoutoutId: number;
  
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
    }
  }
}