import * as appSettings from 'application-settings';

interface IAPP_SETTING_KEYS {
  INTRO: string;
  SHOUTOUT_START: string;
  SHOUTOUT_ASK_NAME: string;
  SHOUTOUT_READY_MSG_SHOWN: string;
}

export class Config {

  // easy use throughout codebase (firebase user key)
  public static USER_KEY: string;
  // fallback when playlistId is not defined on tracks (from bulk spotify playlist creation)
  public static SELECTED_PLAYLIST_ID: string;
  
  public static APP_SETTING_KEYS: IAPP_SETTING_KEYS = {
    INTRO: `viewed-intro`,
    SHOUTOUT_START: 'shoutout-start',
    SHOUTOUT_ASK_NAME: 'shoutout-ask-name',
    SHOUTOUT_READY_MSG_SHOWN: 'shoutout-ready-msg-shown'
  };

  public static SEEN_INTRO(): boolean {
    // return true;
    return appSettings.getBoolean(Config.APP_SETTING_KEYS.INTRO, false);
  }

  public static SET_SEEN_INTRO(value: boolean): void {
    appSettings.setBoolean(Config.APP_SETTING_KEYS.INTRO, value);
  }

  public static SHOUTOUT_START_TIME(): number {
    return appSettings.getNumber(Config.APP_SETTING_KEYS.SHOUTOUT_START, 6000);
  }

  public static SET_SHOUTOUT_START_TIME(value: number): void {
    appSettings.setNumber(Config.APP_SETTING_KEYS.SHOUTOUT_START, value);
  }

  public static SHOUTOUT_ASK_NAME(): boolean {
    return appSettings.getBoolean(Config.APP_SETTING_KEYS.SHOUTOUT_ASK_NAME, false);
  }

  public static SET_SHOUTOUT_ASK_NAME(value: boolean): void {
    appSettings.setBoolean(Config.APP_SETTING_KEYS.SHOUTOUT_ASK_NAME, value);
  }

  public static SHOUTOUT_READY_SHOWN(): boolean {
    return appSettings.getBoolean(Config.APP_SETTING_KEYS.SHOUTOUT_READY_MSG_SHOWN, false);
  }

  public static SET_SHOUTOUT_READY_SHOWN(value: boolean): void {
    appSettings.setBoolean(Config.APP_SETTING_KEYS.SHOUTOUT_READY_MSG_SHOWN, value);
  }

  public static DEBUG: any = {
    LEVEL_1: false, // .info only
    LEVEL_2: false, // .warn only
    LEVEL_3: false, // .error only
    LEVEL_4: false  // .log + all the above
  };
  
  public static IS_DEBUG_MODE(): boolean {
    for (let key in Config.DEBUG) {
      if (Config.DEBUG[key]) {
        // if any level is on, debug mode is on
        return true;
      }
    }
    return false;
  }    
  
  // reset debug defaults
  public static RESET() {
    for (let key in Config.DEBUG) {
      Config.DEBUG[key] = false; 
    }
  }
}
