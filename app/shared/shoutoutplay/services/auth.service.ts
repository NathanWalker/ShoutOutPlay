// angular
import {Injectable} from '@angular/core';

// nativescript
import {device} from 'platform';
import * as http from 'http';

// libs
import {Store, ActionReducer, Action} from '@ngrx/store';
import {Observable} from 'rxjs/Observable';
import {TNSSpotifyAuth} from 'nativescript-spotify';

// app
import {Analytics, AnalyticsService} from '../../analytics/index';
import {LogService} from '../../core/index';

// analytics
const CATEGORY: string = 'Auth';

/**
 * ngrx setup start --
 */
export interface IAuthState {
  loggedIn: boolean;
  currentUser?: any;
}

const initialState: IAuthState = {
  loggedIn: false
};

export const AUTH_ACTIONS: any = {
  LOGGED_IN_CHANGE: `${CATEGORY}_LOGGED_IN_CHANGE`,
  SET_CURRENT_USER: `${CATEGORY}_SET_CURRENT_USER`
};

export const authReducer: ActionReducer<IAuthState> = (state: IAuthState = initialState, action: Action) => {
  let changeState = () => {
    return Object.assign({}, state, action.payload);
  };
  switch (action.type) {
    case AUTH_ACTIONS.LOGGED_IN_CHANGE:
      return changeState();
    case AUTH_ACTIONS.SET_CURRENT_USER:
      return changeState();
    default:
      return state;
  }
};
/**
 * ngrx end --
 */

var Base64: any;

@Injectable()
export class AuthService extends Analytics {
  public state$: Observable<any>;

  constructor(public analytics: AnalyticsService, private logger: LogService, private store: Store<any>) {
    super(analytics);
    this.category = CATEGORY;

    this.state$ = store.select('auth');
    store.select(state => state.auth.loggedIn).subscribe((loggedIn: boolean) => {
      console.log(`AuthService loggedIn state change: ${loggedIn}`);
      this.track(AUTH_ACTIONS.LOGGED_IN_CHANGE, { label: loggedIn.toString() });
    }); 

    TNSSpotifyAuth.VERIFY_SESSION().then(() => {
      this.setLoggedIn(true);
    }, () => {
      this.logger.debug(`TNSSpotifyAuth.VERIFY_SESSION failed...`);
      this.setLoggedIn(false);
    });
  }

  public login() {
    TNSSpotifyAuth.LOGIN();
  }

  public sendRequests(choices: any) {
    if (choices) {
      // mailgun
      let url: string = 'https://api.mailgun.net/v3/mg.shoutoutplay';
      let key: string = Base64.btoa('api:key-ea74616da15d81bd21718b1eb13eccc9');
      let msg = `These integrations would be awesome:\n`;
      for (let key in choices) {
        if (choices[key]) {
          msg = msg + `${key}\n`;
        }
      }
      let deviceInfo = `${device.model}, ${device.deviceType}, ${device.osVersion}, ${device.sdkVersion}`;
      let subject = `Integration Request ${Math.floor(Math.random()*1000)} - ${deviceInfo}`;
      http.request({
        url: `${url}/messages`,
        method: "POST",
        headers: { "Authorization": "Basic " + key },
        content: `from=info@shoutoutplay.com&to=shoutoutplayapp@gmail.com&subject=${subject}&text=` + msg
      }).then((success:any) => {
        this.logger.debug(`SUCCESS`);
        this.logger.debug(JSON.stringify(success));    
      }, (error:any) => {
        this.logger.debug(`ERROR`);
        this.logger.debug(error);
      });
    }
  }

  private setLoggedIn(loggedIn: boolean) {
    this.logger.debug(`setLoggedIn: ${loggedIn}`);
    setTimeout(() => {
      this.store.dispatch({ type: AUTH_ACTIONS.LOGGED_IN_CHANGE, payload: { loggedIn } });
    }, 500);
  }
}

var _Base64 = global.Base64;
var version = "2.1.9";
var buffer;
// constants
var b64chars
    = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
var b64tab = function(bin) {
    var t = {};
    for (var i = 0, l = bin.length; i < l; i++) t[bin.charAt(i)] = i;
    return t;
}(b64chars);
var fromCharCode = String.fromCharCode;
// encoder stuff
var cb_utob = function (c) {
  var cc: any;
    if (c.length < 2) {
        cc = c.charCodeAt(0);
        return cc < 0x80 ? c
            : cc < 0x800 ? (fromCharCode(0xc0 | (cc >>> 6))
                            + fromCharCode(0x80 | (cc & 0x3f)))
            : (fromCharCode(0xe0 | ((cc >>> 12) & 0x0f))
                + fromCharCode(0x80 | ((cc >>>  6) & 0x3f))
                + fromCharCode(0x80 | ( cc         & 0x3f)));
    } else {
        cc = 0x10000
            + (c.charCodeAt(0) - 0xD800) * 0x400
            + (c.charCodeAt(1) - 0xDC00);
        return (fromCharCode(0xf0 | ((cc >>> 18) & 0x07))
                + fromCharCode(0x80 | ((cc >>> 12) & 0x3f))
                + fromCharCode(0x80 | ((cc >>>  6) & 0x3f))
                + fromCharCode(0x80 | ( cc         & 0x3f)));
    }
};
var re_utob = /[\uD800-\uDBFF][\uDC00-\uDFFFF]|[^\x00-\x7F]/g;
var utob = function(u) {
    return u.replace(re_utob, cb_utob);
};
var cb_encode = function(ccc) {
    var padlen = [0, 2, 1][ccc.length % 3],
    ord = ccc.charCodeAt(0) << 16
        | ((ccc.length > 1 ? ccc.charCodeAt(1) : 0) << 8)
        | ((ccc.length > 2 ? ccc.charCodeAt(2) : 0)),
    chars = [
        b64chars.charAt( ord >>> 18),
        b64chars.charAt((ord >>> 12) & 63),
        padlen >= 2 ? '=' : b64chars.charAt((ord >>> 6) & 63),
        padlen >= 1 ? '=' : b64chars.charAt(ord & 63)
    ];
    return chars.join('');
};
var btoa = global.btoa ? function(b) {
    return global.btoa(b);
} : function(b) {
    return b.replace(/[\s\S]{1,3}/g, cb_encode);
};
var _encode = buffer ? function (u) {
    return (u.constructor === buffer.constructor ? u : new buffer(u))
    .toString('base64')
}
: function (u) { return btoa(utob(u)) }
;
var encode = function(u, urisafe) {
    return !urisafe
        ? _encode(String(u))
        : _encode(String(u)).replace(/[+\/]/g, function(m0) {
            return m0 == '+' ? '-' : '_';
        }).replace(/=/g, '');
};
var encodeURI = function(u) { return encode(u, true) };
// decoder stuff
var re_btou = new RegExp([
    '[\xC0-\xDF][\x80-\xBF]',
    '[\xE0-\xEF][\x80-\xBF]{2}',
    '[\xF0-\xF7][\x80-\xBF]{3}'
].join('|'), 'g');
var cb_btou = function(cccc) {
    switch(cccc.length) {
    case 4:
        var cp = ((0x07 & cccc.charCodeAt(0)) << 18)
            |    ((0x3f & cccc.charCodeAt(1)) << 12)
            |    ((0x3f & cccc.charCodeAt(2)) <<  6)
            |     (0x3f & cccc.charCodeAt(3)),
        offset = cp - 0x10000;
        return (fromCharCode((offset  >>> 10) + 0xD800)
                + fromCharCode((offset & 0x3FF) + 0xDC00));
    case 3:
        return fromCharCode(
            ((0x0f & cccc.charCodeAt(0)) << 12)
                | ((0x3f & cccc.charCodeAt(1)) << 6)
                |  (0x3f & cccc.charCodeAt(2))
        );
    default:
        return  fromCharCode(
            ((0x1f & cccc.charCodeAt(0)) << 6)
                |  (0x3f & cccc.charCodeAt(1))
        );
    }
};
var btou = function(b) {
    return b.replace(re_btou, cb_btou);
};
var cb_decode = function(cccc) {
    var len = cccc.length,
    padlen = len % 4,
    n = (len > 0 ? b64tab[cccc.charAt(0)] << 18 : 0)
        | (len > 1 ? b64tab[cccc.charAt(1)] << 12 : 0)
        | (len > 2 ? b64tab[cccc.charAt(2)] <<  6 : 0)
        | (len > 3 ? b64tab[cccc.charAt(3)]       : 0),
    chars = [
        fromCharCode( n >>> 16),
        fromCharCode((n >>>  8) & 0xff),
        fromCharCode( n         & 0xff)
    ];
    chars.length -= [0, 0, 2, 1][padlen];
    return chars.join('');
};
var atob = global.atob ? function(a) {
    return global.atob(a);
} : function(a){
    return a.replace(/[\s\S]{1,4}/g, cb_decode);
};
var _decode = buffer ? function(a) {
    return (a.constructor === buffer.constructor
            ? a : new buffer(a, 'base64')).toString();
}
: function(a) { return btou(atob(a)) };
var decode = function(a){
    return _decode(
        String(a).replace(/[-_]/g, function(m0) { return m0 == '-' ? '+' : '/' })
            .replace(/[^A-Za-z0-9\+\/]/g, '')
    );
};
// export Base64
Base64 = {
    VERSION: version,
    atob: atob,
    btoa: btoa,
    fromBase64: decode,
    toBase64: encode,
    utob: utob,
    encode: encode,
    encodeURI: encodeURI,
    btou: btou,
    decode: decode
};
console.log(`created Base64`);
console.log(Base64);