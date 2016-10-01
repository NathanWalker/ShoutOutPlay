import {TNSSpotifyAuth} from 'nativescript-spotify';
import {SplashScreen} from 'nativescript-splashscreen';
import {Config} from '../services/config.service';

declare var UIApplicationDelegate: any;
var FRESH_LAUNCH: boolean = true;

export class SpotifyAppDelegate extends UIResponder {
  public static ObjCProtocols = [UIApplicationDelegate];
  
  public applicationDidFinishLaunchingWithOptions(application: UIApplication, launchOptions: NSDictionary): boolean {
    return true;
  }
  
  public applicationOpenURLSourceApplicationAnnotation(application, url, sourceApplication, annotation) { 
    console.log('applicationOpenURLSourceApplicationAnnotation:');
    if (url) {
      let scheme = url.scheme;
      let path = url.path;
      let query = url.query;
      console.log(`scheme: ${scheme}, path: ${path}, query: ${query}`);
      let urlString = url.absoluteString;
      console.log(urlString);
      if (urlString.indexOf('spotifylogin') > -1) {
        return TNSSpotifyAuth.HANDLE_AUTH_CALLBACK(url);
      } else if (query && query.indexOf('n=') > -1 && query.indexOf('ti=') > -1) {
        // sample query: n=Nathan&u=user_id&ti=timestamp&t=trackId
        // emit share url value for observers to react to
        Config.SHARE_URL$.next(urlString);
      }
    }
    return true;
  }

  public applicationDidBecomeActive(application: UIApplication): void {
    if (FRESH_LAUNCH) {
      console.log(`FRESH_LAUNCH`);
      
      FRESH_LAUNCH = false;
      let splash = new SplashScreen('logo-800.png', '#7C3FE8');
      application.keyWindow.addSubview(splash.start());
    } 
  }
}