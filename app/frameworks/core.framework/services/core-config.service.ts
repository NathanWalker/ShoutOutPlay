import * as appSettings from 'application-settings';

interface APP_SETTING_KEYSI {
  INTRO: string;
}

export class CoreConfigService {
  
  public static APP_SETTING_KEYS: APP_SETTING_KEYSI = {
    INTRO: `viewed-intro`
  };

  public static SEEN_INTRO(): boolean {
    // return true;
    return appSettings.getBoolean(CoreConfigService.APP_SETTING_KEYS.INTRO, false);
  }

  public static SET_SEEN_INTRO(value: boolean): void {
    appSettings.setBoolean(CoreConfigService.APP_SETTING_KEYS.INTRO, value);
  }

  public static DEBUG: any = {
    LEVEL_1: false, // .info only
    LEVEL_2: false, // .warn only
    LEVEL_3: false, // .error only
    LEVEL_4: false  // .log + all the above
  };
  
  public static IS_DEBUG_MODE(): boolean {
    for (let key in CoreConfigService.DEBUG) {
      if (CoreConfigService.DEBUG[key]) {
        // if any level is on, debug mode is on
        return true;
      }
    }
    return false;
  }    
  
  // reset debug defaults
  public static RESET() {
    for (let key in CoreConfigService.DEBUG) {
      CoreConfigService.DEBUG[key] = false; 
    }
  }
}
