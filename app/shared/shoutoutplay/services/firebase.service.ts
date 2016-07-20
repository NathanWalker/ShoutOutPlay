// angular
import {Injectable, NgZone} from '@angular/core';

// nativescript
import * as app from 'application';
import * as platform from 'platform';
import {knownFolders} from 'file-system';
import {TNSSpotifyConstants, TNSSpotifyAuth} from 'nativescript-spotify';
import firebase = require("nativescript-plugin-firebase");

// libs
import {Store, ActionReducer, Action} from '@ngrx/store';
import {Effect, toPayload, StateUpdates} from '@ngrx/effects';
import {Observable} from 'rxjs/Observable';
import {isString, isObject, keys, orderBy} from 'lodash';

// app
import {PlaylistModel, ShoutoutModel, ShoutOutPlayUser, AuthStateI, SHOUTOUT_ACTIONS} from '../index';
import {Config, LogService, DialogsService, FancyAlertService, Utils} from '../../core/index';

// analytics
const CATEGORY: string = 'Firebase';

declare var MBProgressHUDModeCustomView: any;
declare var zonedCallback: Function;

/**
 * ngrx setup start --
 */
export interface FirebaseChangesI {
  playlists?: Array<PlaylistModel>;
  shoutouts?: Array<ShoutoutModel>;
}
export interface FirebaseStateI {
  playlists?: Array<PlaylistModel>;
  shoutouts?: Array<ShoutoutModel>;
  selectedPlaylistId?: string;
  selecting?: boolean;
}

const initialState: FirebaseStateI = {
  playlists: [],
  shoutouts: []
};

interface FIREBASE_ACTIONSI {
  CREATE: string;
  CREATE_SHOUTOUT: string;
  UPDATE: string;
  UPDATE_PLAYLIST: string;
  PROCESS_UPDATES: string;
  DELETE: string;
  DELETE_TRACK: string;
  PLAYLIST_DELETED: string;
  SHOUTOUT_DELETED: string;
  SELECT_PLAYLIST: string;
  RESET_PLAYLISTS: string;
  REORDER: string;
}

export const FIREBASE_ACTIONS: FIREBASE_ACTIONSI = {
  CREATE: `[${CATEGORY}] CREATE`,
  CREATE_SHOUTOUT: `[${CATEGORY}] CREATE_SHOUTOUT`,
  UPDATE: `[${CATEGORY}] UPDATE`,
  UPDATE_PLAYLIST: `[${CATEGORY}] UPDATE_PLAYLIST`,
  PROCESS_UPDATES: `[${CATEGORY}] PROCESS_UPDATES`,
  DELETE: `[${CATEGORY}] DELETE`,
  DELETE_TRACK: `[${CATEGORY}] DELETE_TRACK`,
  PLAYLIST_DELETED: `[${CATEGORY}] PLAYLIST_DELETED`,
  SHOUTOUT_DELETED: `[${CATEGORY}] SHOUTOUT_DELETED`,
  SELECT_PLAYLIST: `[${CATEGORY}] SELECT_PLAYLIST`,
  RESET_PLAYLISTS: `[${CATEGORY}] RESET_PLAYLISTS`,
  REORDER: `[${CATEGORY}] REORDER`
};

export const firebaseReducer: ActionReducer<FirebaseStateI> = (state: FirebaseStateI = initialState, action: Action) => {
  let changeState = () => {
    if (!action.payload) {
      action.payload = {};
    }
    if (!action.payload.selecting) {
      action.payload.selecting = false;
    }
    return Object.assign({}, state, action.payload);
  };
  switch (action.type) {
    case FIREBASE_ACTIONS.UPDATE:
      return changeState();
    case FIREBASE_ACTIONS.UPDATE_PLAYLIST:
      var playlists = [...state.playlists];
      for (let playlist of playlists) {
        if (playlist.id === action.payload.id) {
          playlist = action.payload;
          break;
        }
      }
      action.payload = { playlists };
      return changeState();
    case FIREBASE_ACTIONS.RESET_PLAYLISTS:
      // resets playing state of all playlists and tracks
      var playlists = [...state.playlists];
      for (let p of playlists) {
        p.playing = false;
        for (let t of p.tracks) {
          t.playing = false;
        }
      }
      action.payload = { playlists };
      return changeState();
    default:
      return state;
  }
};
/**
 * ngrx end --
 */

interface IFirebaseUser {
  uid: string;
  email: string;
  emailVerified: boolean;
  name?: string;
  refreshToken?: string;
  profileImageURL?: string;
}

@Injectable()
export class FirebaseService {
  public state$: Observable<FirebaseStateI>;
  private _initialized: boolean = false;
  private _firebaseUser: IFirebaseUser; // logged in firebase user
  private _userProduct: any; // cache spotify product to store with firebase user
  private _passSuffix: string = 'A814~'; // make passwords strong
  private _ignoreUpdate: boolean = false;

  constructor(private store: Store<any>, private logger: LogService, private dialogs: DialogsService, private fancyalert: FancyAlertService, private ngZone: NgZone) {
    this.init();   
  }

  public processUpdates(data: any) {
    switch (data.type) {
      case 'playlist':
        this.updatePlaylist(data);
        break;
    }
  }

  public addDocument(data: any) {
    switch (data.type) {
      case 'playlist':
        this.addNewPlaylist(data);
        break;
      case 'shoutout':
        this.addNewShoutout(data);
        break;
    }
  }

  public deleteDocument(data: any) {
    switch (data.type) {
      case 'playlist':
        this.deletePlaylist(data);
        break;
      case 'shoutout':
        this.deleteShoutout(data);
        break;
    }
  }

  public reorder(data: any) {
    switch (data.type) {
      case 'playlist':
        this.reorderPlaylists(data);
        break;
      case 'track':
        this.reorderTracks(data);
        break;
    }
  }

  public removeShoutoutFromTrack(shoutout: ShoutoutModel) {
    this._ignoreUpdate = false;
    // remove remotely
    this.deleteRemoteFile(shoutout.filename);

    this.store.take(1).subscribe((s: any) => {
      let updatedPlaylist;
      for (let p of [...s.firebase.playlists]) {
        if (p.id == shoutout.playlistId) {
          updatedPlaylist = p;
          for (let t of updatedPlaylist.tracks) {
            if (t.shoutoutId == shoutout.id) {
              t.shoutoutId = undefined;
              break;
            }
          }
        }
      }
      this.processUpdates(updatedPlaylist);
    });
  }

  public downloadFile(filename: string): Promise<any> {
    let remotePath = `${Config.USER_KEY}/${filename}`;
    this.logger.debug(`downloading remote file: ${remotePath}`);
    let localPath = Utils.documentsPath(filename);
    this.logger.debug(`to: ${localPath}`);

    // this will create or overwrite a local file in the app's documents folder
    let localFile = knownFolders.documents().getFile(filename);

    return firebase.downloadFile({
      remoteFullPath: remotePath,
      localFullPath: localPath
    });
  }

  public uploadFile(filename: string): Promise<any> {
    this.logger.debug(`uploading file: ${filename}`);
    let remotePath = `${Config.USER_KEY}/${filename}`;
    this.logger.debug(`to: ${remotePath}`);
    return firebase.uploadFile({
      remoteFullPath: remotePath,
      localFullPath: Utils.documentsPath(filename)
    });
  }

  public deleteFile(filename: string): Promise<any> {
    let remotePath = `${Config.USER_KEY}/${filename}`;
    this.logger.debug(`deleting remote file: ${remotePath}`);
    return firebase.deleteFile({
      remoteFullPath: remotePath
    });
  }

  /**
   * Following auth methods are based on users Spotify login account
   **/
  public authenticate(email: string, pass: string) {
    pass = pass + this._passSuffix;
    this.logger.debug(`authenticate: ${email}, ${pass}`);
    firebase.login({
      type: firebase.LoginType.PASSWORD,
      email: email,
      password: pass
    }).then((result: any) => {
      // the result object has these properties: uid, provider, expiresAtUnixEpochSeconds, profileImageURL, token
      this.logger.debug(`firebase authenticate success.`);
      // no need to handle anything here since we use `onAuthStateChanged` in init
    }, (error: any) => {
      this.logger.debug(`firebase auth error:`);
      this.logger.debug(error);
      if (isString(error)) {
        if (error.indexOf(`An internal error has occurred`) > -1 || error.indexOf('There is no user record') > -1) {
          // user not found, create one
          this.createUser(email, pass);
        } else if (error.indexOf('The password is invalid') > -1) {
          this.fancyalert.show('It appears your password may be incorrect for that account. Please try again. If you continue to receive this message, please send a quick email to: support@shoutoutplay.com with your account email to reset the password.');
          TNSSpotifyAuth.LOGOUT();
        }  
      } else if (isObject(error)) {
        for (let key in error) {
          this.logger.debug(error[key]);
        }
      }
    });
  }

  public createUser(email: string, pass: string) {
    this.logger.debug(`createUser: ${email}, ${pass + this._passSuffix}`);
    firebase.createUser({
      email: email,
      password: pass + this._passSuffix
    }).then((result: any) => {
      this.logger.debug(`firebase createUser success:`);
      this.logger.debug(result);
      for (let key in result) {
        this.logger.debug(key);
        this.logger.debug(result[key]);
      }
      this.authenticate(email, pass);
    }, (error: any) => {
      this.logger.debug(`firebase createUser error:`);
      this.logger.debug(error);
      if (isString(error)) {
        if (error.indexOf(`The email address is already`) > -1) {
          this.fancyalert.show(error);
        } else if (error.indexOf(`An internal error has occurred`) > -1) {
          // could not create user
          this.fancyalert.show(`An error occurred. Please try quitting the app and restarting it.`);
        }   
      } else if (isObject(error)) {
        for (let key in error) {
          this.logger.debug(error[key]);
        }
      }
    });
  }

  private addNewPlaylist(playlist: PlaylistModel) {
    if (Config.USER_KEY) {
      this.stripFunctions(playlist);
      firebase.push(
        `/users/${Config.USER_KEY}/playlists`,
        playlist
      ).then((result: any) => {
        this.logger.debug(`New Playlist created: ${result.key}`);
      })
    }
  }

  private addNewShoutout(shoutout: ShoutoutModel) {
    if (Config.USER_KEY) {
      this._ignoreUpdate = true;
      this.stripFunctions(shoutout);
      firebase.push(
        `/users/${Config.USER_KEY}/shoutouts`,
        shoutout
      ).then((result: any) => {
        this.logger.debug(`New Shoutout created: ${result.key}`);
        this.uploadFile(shoutout.filename);

        this.store.take(1).subscribe((s: any) => {
          let playlists = [...s.firebase.playlists];
          // update the track inside the correct playlist
          let updatedPlaylist: PlaylistModel;

          for (let playlist of playlists) {
            this.logger.debug('looking for playlist...');
            if (shoutout.playlistId === playlist.id) {
              updatedPlaylist = playlist;
              this.logger.debug('found playlist');
              for (let track of updatedPlaylist.tracks) {
                if (shoutout.trackId === track.id) {
                  this.logger.debug('found track');
                  track.shoutoutId = result.key;
                  break;
                }
              }
            }
          }   

          this.updatePlaylist(updatedPlaylist);
        });
      })
    }
  }

  private updatePlaylist(playlist: PlaylistModel) {
    if (Config.USER_KEY) {
      this._ignoreUpdate = false;
      this.logger.debug(`About to update playlist...`);
      // for (let key in playlist) {
      //   this.logger.debug(`${key}: ${playlist[key]}`);
      // }
      let id = playlist.id;
      delete playlist.id; // don't store id since firebase uses it as key
      this.logger.debug(`Updating playlist with id: ${id}`);
      firebase.update(
        `/users/${Config.USER_KEY}/playlists/${id}`,
        playlist
      ).then((result: any) => {
        this.logger.debug(`Playlist updated.`);
      });
    }
  }

  private updatePlaylists(playlists: Array<PlaylistModel>) {
    if (Config.USER_KEY) {
      this._ignoreUpdate = false;
      let playlistsObject = {};
      for (let p of playlists) {
        let id = p.id;
        delete p.id;
        playlistsObject[id] = p;
      }   
      this.logger.debug(`Updating all playlists: ${playlists.map(p => p.id).join(',')}`);
      firebase.update(
        `/users/${Config.USER_KEY}/playlists`,
        playlistsObject
      ).then((result: any) => {
        this.logger.debug(`All playlists updated.`);
      });
    }
  }

  private deletePlaylist(playlist: PlaylistModel) {
    // this._ignoreUpdate = false;
    this.logger.debug(`Deleting playlist with id: ${playlist.id}`);
    firebase.remove(
      `/users/${Config.USER_KEY}/playlists/${playlist.id}`
    ).then((result: any) => {
      this.logger.debug(`Playlist deleted.`);
      this.store.dispatch({ type: FIREBASE_ACTIONS.PLAYLIST_DELETED, payload: playlist });
      // TODO: loop through tracks and remove shoutouts attached to all the tracks.
      // OR: leave shoutouts but remove trackId and playlistId references in them
      // ^ would require the ability to add existing shoutouts to other tracks
    });
  }

  private deleteShoutout(shoutout: ShoutoutModel) {
    this._ignoreUpdate = true;
    firebase.remove(
      `/users/${Config.USER_KEY}/shoutouts/${shoutout.id}`
    ).then((result: any) => {
      this.logger.debug(`Shoutout deleted.`);
      this.ngZone.run(() => {
        this.store.dispatch({ type: FIREBASE_ACTIONS.SHOUTOUT_DELETED, payload: shoutout });
      });  
    });
  }  

  private deleteRemoteFile(filename: string) {
    this.store.dispatch({ type: SHOUTOUT_ACTIONS.REMOVE_REMOTE, payload: filename });
  }

  private reorderPlaylists(data: any) {
    this.store.take(1).subscribe((s: any) => {
      let playlists = [...s.firebase.playlists];
      let targetItem = playlists[data.itemIndex];
      targetItem.order = data.targetIndex;
      this.logger.debug(`Reordering playlists, setting order: ${targetItem.order} of ${playlists.length} playlists.`);
      for (var i = 0; i < playlists.length; i++) {
        if (targetItem.id !== playlists[i].id) {
          this.logger.debug(`${playlists[i].name} - setting order: ${i}`);
          playlists[i].order = i;
        }
      }
      this.updatePlaylists(playlists);
    });
  }

  private reorderTracks(data: any) {
    if (data.playlist) {
      let targetItem = data.playlist.tracks[data.itemIndex];
      targetItem.order = data.targetIndex;
      this.logger.debug(`Reordering tracks, setting order: ${targetItem.order} of ${data.playlist.tracks.length} tracks.`);
      for (var i = 0; i < data.playlist.tracks.length; i++) {
        if (targetItem.id !== data.playlist.tracks[i].id) {
          this.logger.debug(`${data.playlist.tracks[i].name} - setting order: ${i}`);
          data.playlist.tracks[i].order = i;
        }
      }
      this.updatePlaylist(data.playlist);
    }
  }

  private init() {
    this.state$ = this.store.select('firebase');
    this.store.select('auth').subscribe((s: AuthStateI) => {
      if (s.loggedIn) {
        // try to log user in or create an account based on their spotify account
        TNSSpotifyAuth.CURRENT_USER().then((user: any) => {
          this.logger.debug(`Spotify user:`);
          this.logger.debug(`email: ${user.emailAddress}`);
          this.logger.debug(`uri: ${user.uri}`);
          this.logger.debug(`product: ${user.product}`);
          this._userProduct = user.product;
          // for (let key in user) {
          //   this.logger.debug(key);
          //   this.logger.debug(user[key]);
          // }
          var login = () => {
            this.authenticate(user.emailAddress, user.uri);
          };
          if (user.emailAddress) {
            if (!this._firebaseUser) {
              // not previously logged in, go ahead and login
              login();
            } else if (this._firebaseUser.email !== user.emailAddress) {
              // log previously logged in user out, and login new user
              firebase.logout().then(() => {
                this.resetInitializers();
                login();
              });
            }     
          } 
        }, (error: any) => {
          this.logger.debug(`spotify current_user error:`);
          this.logger.debug(error);
          for (let key in error) {
            this.logger.debug(error[key]);
          }
        });
      } else if (this._firebaseUser) {
        firebase.logout().then(() => {
          this.resetInitializers();
        });
      }
    });


    /**
     * INIT FIREBASE PLUGIN
     **/
    firebase.init({
      persist: true,
      storageBucket: 'gs://shoutoutplay.appspot.com',
      // iOSEmulatorFlush: true,
      onAuthStateChanged: (data) => {
        // optional but useful to immediately re-logon the user when he re-visits your app
        this.logger.debug(`Logged ${data.loggedIn ? 'into' : 'out of'} firebase.`);
        if (data.loggedIn && !this._firebaseUser) {
          this.logger.debug(`User's email address: ${data.user.email ? data.user.email : 'N/A'}`);
          this.logger.debug(`User's uid: ${data.user.uid}`);
          this._firebaseUser = <any>data.user;
          this.listenToUser(this._firebaseUser.uid);
        }
      }
    }).then((instance) => {
      this.logger.debug("firebase.init done");
    }, (error) => {
      this.logger.debug("firebase.init error: " + error);
    });
  }

  private listenToUser(uid: string, singleEvent: boolean = true) {
    this.logger.debug(`listenToUser, singleEvent: ${singleEvent}`);
    let cb = singleEvent ?
      this.checkIfUserExists.bind(this) :
      this.userSync.bind(this);
    firebase.query(
      cb,
      "/users",
      {
        singleEvent: singleEvent,
        orderBy: {
          type: firebase.QueryOrderByType.CHILD,
          value: 'uid' // mandatory when type is 'child'
        },
        range: {
          type: firebase.QueryRangeType.EQUAL_TO,
          value: uid
        },
        limit: {
          type: firebase.QueryLimitType.LAST,
          value: 1
        }
      }
    );
  }

  private checkIfUserExists(result: any) {
    this.logger.debug(`checkIfUserExists...`);
    if (result) {
      if (result.value) {
        this.logger.debug(`----- User exists, listenToUser ------`);
        this.listenToUser(this._firebaseUser.uid, false);
      } else {
        // add new user
        this.addNewUser();
      }
    }
  }

  private userSync(result: any) {
    if (!this._ignoreUpdate) {
      this.logger.debug(`userSync ----------------------------`);
      if (result) {
        // for (let key in result) {
        //   this.logger.debug(`${key}: ${result[key]}`);
        // }
        if (result.key && !Config.USER_KEY) {
          this.logger.debug(`ATTN: setting firebase user key ----------------- ${result.key}`);
          // for static access across other services
          Config.USER_KEY = result.key;
        }
        if (result.value) {
          // this.logger.debug(`----- VALUE ------`);
          for (let key in result.value) {
            this.logger.debug(`${key}: ${result.value[key]}`);
          }
          this.updateState(result.value);
        } 
      }
    }
  }

  private updateState(user: any) {
    if (user) {
      this.store.take(1).subscribe((s: any) => {
        let startingCnt = {
          playlists: s.firebase.playlists.length,
          shoutouts: s.firebase.shoutouts.length
        };
        let playlists = [];
        let shoutouts = [];
        if (user.playlists) {
          for (let id in user.playlists) {
            playlists.push(new PlaylistModel(Object.assign({ id: id }, user.playlists[id])));
          }
        }
        if (user.shoutouts) {
          for (let id in user.shoutouts) {
            shoutouts.push(new ShoutoutModel(Object.assign({ id: id }, user.shoutouts[id])));
          }
        }
        // order arrays by order property
        playlists = orderBy(playlists, ['order'], ['asc']);
        shoutouts = orderBy(shoutouts, ['order'], ['asc']);

        if (this._initialized) {
          // only if state has been initialized
          let msg = '';
          if (playlists.length < startingCnt.playlists || shoutouts.length < startingCnt.shoutouts) {
            msg = 'Deleted';
          } else if (playlists.length > startingCnt.playlists || shoutouts.length > startingCnt.shoutouts) {
            msg = 'Saved';
          }
          if (msg) {
            this.dialogs.success(msg);
          }
        } else {
          this._initialized = true;
          this.store.dispatch({ type: SHOUTOUT_ACTIONS.DOWNLOAD_SHOUTOUTS, payload: shoutouts });
        }

        this.ngZone.run(() => {
          this.logger.debug(`ngZone State Updates...`);
          this.logger.debug(`playlists.length: ${playlists.length}`);
          this.logger.debug(`shoutouts.length: ${shoutouts.length}`);
          this.store.dispatch({ type: FIREBASE_ACTIONS.UPDATE, payload: { playlists, shoutouts } });
        });
      });
    }
  }

  /**
   * Adds new Firebase user to manage playlists/shoutouts
   **/
  private addNewUser() {
    if (this._firebaseUser) {
      let newUser = new ShoutOutPlayUser({
        uid: this._firebaseUser.uid,
        email: this._firebaseUser.email,
        product: this._userProduct
      });
      firebase.push(
        '/users',
        newUser
      ).then((result: any) => {
        this.logger.debug(`firebase.push result:`);
        this.logger.debug(result);
        if (isObject(result)) {
          for (let key in result) {
            this.logger.debug(key);
            this.logger.debug(result[key]);
          }
          this.listenToUser(this._firebaseUser.uid, false);
        }
      });
    }
  }

  private resetInitializers() {
    this._firebaseUser = undefined;
    Config.USER_KEY = undefined;
    this._initialized = false;
    this._ignoreUpdate = false;
    // reset state
    // don't really need to do this since it's reset when user logs back in
    // also it causes an error if non-premium user tries to play a track in a playlist
    // since it clears all playlists and messes up view binding
    // this.ngZone.run(() => {
    //   this.store.dispatch({ type: FIREBASE_ACTIONS.UPDATE, payload: { playlists:[], shoutouts:[] } });
    // });
  }

  private stripFunctions(model: any) {
    for (let key in model) {
      if (typeof model[key] === 'function') {
        console.log(`stripping function: ${key}`);
        delete model[key];
      }
    }
  }
}

@Injectable()
export class FirebaseEffects {
  constructor(private store: Store<any>, private logger: LogService, private updates$: StateUpdates<any>, private firebaseService: FirebaseService) { }
      
  @Effect() processUpdates$ = this.updates$
    .whenAction(FIREBASE_ACTIONS.PROCESS_UPDATES)
    .do((update) => {
      this.logger.debug(`FirebaseEffects.PROCESS_UPDATES`);
      this.firebaseService.processUpdates(update.action.payload);
    })
    .filter(() => false);

  @Effect() create$ = this.updates$
    .whenAction(FIREBASE_ACTIONS.CREATE)
    .do((update) => {
      this.logger.debug(`FirebaseEffects.CREATE`);
      this.firebaseService.addDocument(update.action.payload);
    })
    .filter(() => false);
  
  @Effect() createShoutout$ = this.updates$
    .whenAction(FIREBASE_ACTIONS.CREATE_SHOUTOUT)
    .do((update) => {
      this.logger.debug(`FirebaseEffects.CREATE_SHOUTOUT`);
      this.firebaseService.addDocument(update.action.payload);
    })
    .filter(() => false);
  
  @Effect() delete$ = this.updates$
    .whenAction(FIREBASE_ACTIONS.DELETE)
    .do((update) => {
      this.logger.debug(`FirebaseEffects.DELETE`);
      this.firebaseService.deleteDocument(update.action.payload);
    })
    .filter(() => false);
  
  @Effect() shoutoutDeleted$ = this.updates$
    .whenAction(FIREBASE_ACTIONS.SHOUTOUT_DELETED)
    .do((update) => {
      this.logger.debug(`FirebaseEffects.SHOUTOUT_DELETED`);
      this.firebaseService.removeShoutoutFromTrack(update.action.payload);
    })
    .filter(() => false);
  
  @Effect() reorder$ = this.updates$
    .whenAction(FIREBASE_ACTIONS.REORDER)
    .do((update) => {
      this.logger.debug(`FirebaseEffects.REORDER`);
      this.firebaseService.reorder(update.action.payload);
    })
    .filter(() => false);
  
  @Effect() deleteTrack$ = this.updates$
    .whenAction(FIREBASE_ACTIONS.DELETE_TRACK)
    .map((update) => {
      this.logger.debug(`FirebaseEffects.DELETE_TRACK`);
      let updatedPlaylist;
      this.store.take(1).subscribe((s: any) => {
        let playlists = [...s.firebase.playlists];
        for (let playlist of playlists) {
          if (playlist.id === update.action.payload.playlistId) {
            updatedPlaylist = playlist;
            this.logger.debug(`Removing track...`);
            this.logger.debug(playlist.tracks.length);
            playlist.removeTrack(update.action.payload.track);
            this.logger.debug(playlist.tracks.length);
            break;
          }
        }
      });
      return ({
        type: FIREBASE_ACTIONS.PROCESS_UPDATES,
        payload: updatedPlaylist
      });
    });
}