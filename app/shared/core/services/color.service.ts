import {isIOS, device} from 'platform';
import {Color} from 'color';
import * as app from 'application';
var knife = require('nativescript-swiss-army-knife');

interface ICOLORS {
  BASE: string;
  COMPLIMENTARY: string;
  PRIMARY: string;
  ANDROID_STATUS_BAR: string;
  SECONDARY: string;
  HIGHLIGHT: string;
  BRIGHT: string;
  RED: string;
  WHITE: string;
  YELLOW: string;
  BRIGHT_ALT?: string;
}

const DEFAULT_SCHEME: ICOLORS = {
  BASE: '#010006',
  COMPLIMENTARY: '#010027',
  PRIMARY: '#6a2ecd',
  ANDROID_STATUS_BAR: '#5d27b6',
  SECONDARY: '#000077',
  HIGHLIGHT: '#9f64d8',
  BRIGHT: '#4EFF0B',
  RED: '#BC1224',
  WHITE: '#fff',
  YELLOW: '#FFD110'
};

const GRAY_SCHEME: ICOLORS = {
  BASE: '#333333',
  COMPLIMENTARY: '#444444',
  PRIMARY: '#efefef',
  ANDROID_STATUS_BAR: '#282828',
  SECONDARY: '#555555',
  HIGHLIGHT: '#999999',
  BRIGHT: '#FFD110',
  RED: '#BC1224',
  WHITE: '#fff',
  YELLOW: '#FFD110',
  BRIGHT_ALT: '#FF9505'
};

export class ColorService {

  public static ActiveId: number = 0;  
  public static Active: ICOLORS = DEFAULT_SCHEME;
  public static initialized: boolean = false;

  public static swapScheme(cssFilename: string) {
      
    switch (cssFilename) {
      case 'app.css':
        ColorService.ActiveId = 0;
        ColorService.Active = DEFAULT_SCHEME;
        break;
      case 'gray.css':
        ColorService.ActiveId = 1;
        ColorService.Active = GRAY_SCHEME;
        break;
      // TODO: support more
    }

    // android statusbar
    if (!isIOS) {
      let adjustStatusBar = () => {
        if (app.android && device.sdkVersion >= '21') {
          let LayoutParams = <any>android.view.WindowManager.LayoutParams;
          let window: any;
          if (app.android.foregroundActivity != null) {
            window = app.android.foregroundActivity.getWindow();
          } else {
            window = app.android.startActivity.getWindow();
          }

          window.addFlags(LayoutParams.FLAG_DRAWS_SYSTEM_BAR_BACKGROUNDS);
          window.setStatusBarColor(new Color(ColorService.Active.ANDROID_STATUS_BAR).android);
        }
      };
//       console.log(knife);
//       if (knife.SwissArmyKnife) {
//       for (let key in knife.SwissArmyKnife) {
//   console.log(key);
// }

      if (!ColorService.initialized) {
        ColorService.initialized = true;
        setTimeout(() => {
          // since called in main.ts
          adjustStatusBar();
        // knife.SwissArmyKnife.setAndroidStatusBarColor(statusColor);
        }, 1000);      
      } else {
        adjustStatusBar();
      }     
    }
  }
}