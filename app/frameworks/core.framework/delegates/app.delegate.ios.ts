import {TNSSpotifyConstants, TNSSpotifyAuth} from 'nativescript-spotify';

declare var UIApplicationDelegate: any;

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
}