import {TrackModel} from '../models/track.model';
import {ShoutoutModel} from '../models/shoutout.model';

export class SOPUtils {

  public static getShoutOutPath(track: TrackModel, shoutouts: Array<ShoutoutModel>): string {
    if (track.shoutoutId) {
      // grab shoutout path
      for (let shoutout of shoutouts) {
        if (shoutout.id === track.shoutoutId) {
          return shoutout.filename;
        }
      }
    }
    return null;
  }
}