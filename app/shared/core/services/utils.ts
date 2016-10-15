import {knownFolders} from 'file-system';
import * as http from 'http';
import {isIOS} from 'platform';
import {TNSSpotifyAuth} from 'nativescript-spotify';

export class Utils {
  
  public static getFilename(path: string): string | any {
    if (path) {
      let parts = path.split('/');
      return parts[parts.length - 1];
    } else {
      return;
    }
  }

  public static documentsPath(filename: string) {
    return `${knownFolders.documents().path}/${filename}`;
  }

  public static fetchSpotifyRest(url: string): Promise<any> {
    return new Promise((resolve, reject) => {
      let token = isIOS ? TNSSpotifyAuth.SESSION.accessToken : TNSSpotifyAuth.SESSION;
      http.request({
        url: url,
        method: 'GET',
        headers: { "Content-Type": "application/json", "Authorization:": `Bearer ${token}` }
      }).then((res: any) => {
        // console.log(res);
        // for (let key in res) {
        //   console.log(`key: ${key}`, res[key]);
        // }
        if (res && res.content) {
          let trackObj = JSON.parse(res.content);
          if (trackObj.error) {
            reject();
          } else {
            // for (let key in trackObj) {
            //   console.log(`key: ${key}`, trackObj[key]);
            // }
            let track = {
              name: trackObj.name,
              artist: trackObj.artists && trackObj.artists.length ? trackObj.artists[0].name : 'Unknown'
            };
            
            resolve(track);
          }
        } else {
          reject();
        }       
      }, (err: any) => {
        console.log(err);
        for (let key in err) {
          console.log(`key: ${key}`, err[key]);
        }
        reject(err);
      });
    });
  }
}