import {TNSSpotifyConstants, TNSSpotifyAuth} from 'nativescript-spotify';
import {SplashScreen} from 'nativescript-splashscreen';

declare var UIApplicationDelegate: any;
var FRESH_LAUNCH: boolean = true;

export class SpotifyAppDelegate extends UIResponder {
  public static ObjCProtocols = [UIApplicationDelegate];
  
  public applicationDidFinishLaunchingWithOptions(application: UIApplication, launchOptions: NSDictionary): boolean {
    
    TNSSpotifyConstants.CLIENT_ID = '1acac12e7fc448e188d8d70aa14249df';
    TNSSpotifyAuth.REDIRECT_URL = 'shoutoutplay://spotifylogin';
    return true;
  }
  
  public applicationOpenURLSourceApplicationAnnotation(application, url, sourceApplication, annotation) { 
    return TNSSpotifyAuth.HANDLE_AUTH_CALLBACK(url);
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