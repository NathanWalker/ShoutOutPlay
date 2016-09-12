// angular
import {Injectable, NgZone} from '@angular/core';
import {Location} from '@angular/common';

// nativescript
import * as app from 'application';
import {isIOS} from 'platform';
import {knownFolders} from 'file-system';
import {TNSSpotifyConstants, TNSSpotifyAuth, TNSSpotifyPlaylist} from 'nativescript-spotify';
import firebase = require("nativescript-plugin-firebase");

// libs
import {Store, ActionReducer, Action} from '@ngrx/store';
import {Effect, Actions} from '@ngrx/effects';
import {Observable} from 'rxjs/Observable';
import {isString, isObject, keys, orderBy, includes, find} from 'lodash';

// app
import {Analytics, AnalyticsService} from '../../analytics/index';
import {PlaylistModel, ShoutoutModel, ShoutOutPlayUser, IAuthState, SHOUTOUT_ACTIONS} from '../index';
import {Config, LogService, DialogsService, FancyAlertService, Utils, TextService} from '../../core/index';

// analytics
const CATEGORY: string = 'Firebase';

declare var zonedCallback: Function;

/**
 * ngrx setup start --
 */
export interface IFirebaseChanges {
  playlists?: Array<PlaylistModel>;
  shoutouts?: Array<ShoutoutModel>;
}
export interface IFirebaseState {
  playlists?: Array<PlaylistModel>;
  shoutouts?: Array<ShoutoutModel>;
  selectedPlaylistId?: string;
}

const initialState: IFirebaseState = {
  playlists: [],
  shoutouts: []
};

interface IFIREBASE_ACTIONS {
  CREATE: string;
  CREATE_SHOUTOUT: string;
  UPDATE: string;
  UPDATE_PLAYLIST: string;
  PROCESS_UPDATES: string;
  DELETE: string;
  DELETE_TRACK: string;
  PLAYLIST_DELETED: string;
  SHOUTOUT_DELETED: string;
  RESET_PLAYLISTS: string;
  REORDER: string;
  RESET_ACCOUNT: string;
}

export const FIREBASE_ACTIONS: IFIREBASE_ACTIONS = {
  CREATE: `${CATEGORY}_CREATE`,
  CREATE_SHOUTOUT: `${CATEGORY}_CREATE_SHOUTOUT`,
  UPDATE: `${CATEGORY}_UPDATE`,
  UPDATE_PLAYLIST: `${CATEGORY}_UPDATE_PLAYLIST`,
  PROCESS_UPDATES: `${CATEGORY}_PROCESS_UPDATES`,
  DELETE: `${CATEGORY}_DELETE`,
  DELETE_TRACK: `${CATEGORY}_DELETE_TRACK`,
  PLAYLIST_DELETED: `${CATEGORY}_PLAYLIST_DELETED`,
  SHOUTOUT_DELETED: `${CATEGORY}_SHOUTOUT_DELETED`,
  RESET_PLAYLISTS: `${CATEGORY}_RESET_PLAYLISTS`,
  REORDER: `${CATEGORY}_REORDER`,
  RESET_ACCOUNT: `${CATEGORY}_RESET_ACCOUNT`
};

export const firebaseReducer: ActionReducer<IFirebaseState> = (state: IFirebaseState = initialState, action: Action) => {
  let changeState = () => {
    if (!action.payload) {
      action.payload = {};
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
export class FirebaseService extends Analytics {
  public state$: Observable<IFirebaseState>;
  private _initialized: boolean = false;
  private _firebaseUser: IFirebaseUser; // logged in firebase user
  private _spotifyUserProduct: any; // cache spotify product to store with firebase user
  private _fetchedSpotifyPlaylists: boolean = false;
  private _passSuffix: string = 'A814~'; // make passwords strong
  private _ignoreUpdate: boolean = false;

  constructor(public analytics: AnalyticsService, private store: Store<any>, private logger: LogService, private dialogs: DialogsService, private fancyalert: FancyAlertService, private ngZone: NgZone, private location: Location) {
    super(analytics);
    this.category = CATEGORY;
    this.init();   
  }

  public processUpdates(data: any) {
    if (data) {
      switch (data.type) {
        case 'playlist':
          this.updatePlaylist(data);
          break;
      }
    }
  }

  public addDocument(data: any) {
    if (data) {
      switch (data.type) {
        case 'playlist':
          this.addNewPlaylist(data);
          break;
        case 'shoutout':
          this.addNewShoutout(data);
          break;
      }
    }
  }

  public deleteDocument(data: any) {
    if (data) {
      switch (data.type) {
        case 'playlist':
          this.deletePlaylist(data);
          break;
        case 'shoutout':
          this.deleteShoutout(data);
          break;
      }
    }
  }

  public reorder(data: any) {
    if (data) {
      switch (data.type) {
        case 'playlist':
          this.reorderPlaylists(data);
          break;
        case 'track':
          this.reorderTracks(data);
          break;
      }
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
    let existingSuffix = pass.slice(-5);
    if (existingSuffix !== this._passSuffix) {
      // make valid passwords
      // only if suffix doesn't exist
      pass = pass + this._passSuffix;
    }
    this.logger.debug(`authenticate: ${email}, ${pass}`);
    firebase.login({
      type: firebase.LoginType.PASSWORD,
      email: email,
      password: pass
    }).then((result: any) => {
      TNSSpotifyAuth.CLEAR_COOKIES = false;
      // the result object has these properties: uid, provider, expiresAtUnixEpochSeconds, profileImageURL, token
      this.logger.debug(`firebase authenticate success.`);
      // no need to handle anything here since we use `onAuthStateChanged` in init
    }, (error: any) => {
      this.logger.debug(`firebase auth error:`);
      this.logger.debug(error);
      
      if (isString(error)) {
        let errorTrack = error;
        if (errorTrack.length > 35) {
          // firebase analytics labels limited to 36 characters
          errorTrack = errorTrack.substring(0, 35);
        }
        this.track(`LOGIN_ERROR`, { label: errorTrack });
        if (error.indexOf(`An internal error has occurred`) > -1 || error.indexOf('There is no user record') > -1) {
          // user not found, create one
          this.createUser(email, pass);
        } else if (error.indexOf('The password is invalid') > -1) {
          this.fancyalert.show('It appears your password may be incorrect for that account. If you continue to receive this message, please send a quick email to: support@shoutoutplay.com with your account email to reset the password.');
          TNSSpotifyAuth.CLEAR_COOKIES = true;
          TNSSpotifyAuth.LOGOUT();
        } else {
          this.fancyalert.show(error);
        }
      } else if (isObject(error)) {
        this.logger.debug(`error was an object`);
        this.track(`LOGIN_ERROR`, { label: `Error object` });
        for (let key in error) {
          this.logger.debug(error[key]);
        }
      }
    });
  }

  public createUser(email: string, pass: string) {
    this.logger.debug(`createUser: ${email}, ${pass}`);
    firebase.createUser({
      email: email,
      password: pass
    }).then((result: any) => {
      this.logger.debug(`firebase createUser success:`);
      this.logger.debug(result);
      for (let key in result) {
        this.logger.debug(key);
        this.logger.debug(result[key]);
      }
      this.track(`NEW_USER`, { label: email });
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
        } else {
          this.fancyalert.show('An unknown error has occurred. If you continue to receive this message, please send a quick email to: support@shoutoutplay.com.');
        } 
      } else if (isObject(error)) {
        for (let key in error) {
          this.logger.debug(error[key]);
        }
      }
    });
  }

  public resetAccount() {
    // clear all playlists
    this.logger.debug(`Deleting all playlists...`);
    this.track(`RESET_PLAYLISTS`, { label: Config.USER_KEY });
    firebase.remove(
      `/users/${Config.USER_KEY}/playlists`
    ).then((result: any) => {
      this.logger.debug(`All Playlists deleted.`);
    });
  }

  private addNewPlaylist(playlist: PlaylistModel): Promise<any> {
    return new Promise((resolve, reject) => {
      if (Config.USER_KEY) {
        this.stripFunctions(playlist);
        firebase.push(
          `/users/${Config.USER_KEY}/playlists`,
          playlist
        ).then((result: any) => {
          this.logger.debug(`New Playlist created: ${result.key}`);
          this.track(FIREBASE_ACTIONS.CREATE, { label: `New Playlist` });
          this.dialogs.hide();
          resolve();
        })
      }
    });
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
        this.track(FIREBASE_ACTIONS.CREATE_SHOUTOUT, { label: `New Shoutout` });
        this.uploadFile(shoutout.filename);

        let findPlaylistId;        
        if (shoutout.playlistId) {
          findPlaylistId = shoutout.playlistId;
        } else {
          // a shoutout won't have a playlistId if was from bulk spotify playlist create
          // fallback 
          findPlaylistId = Config.SELECTED_PLAYLIST_ID;
        }

        this.store.take(1).subscribe((s: any) => {
          let playlists = [...s.firebase.playlists];
          // update the track inside the correct playlist
          let updatedPlaylist: PlaylistModel;
          let trackName: string;

          for (let playlist of playlists) {
            this.logger.debug('looking for playlist...');
            
            if (findPlaylistId) {
              if (findPlaylistId === playlist.id) {
                updatedPlaylist = playlist;
                this.logger.debug('found playlist');
                for (let track of updatedPlaylist.tracks) {
                  if (shoutout.trackId === track.id) {
                    this.logger.debug('found track');
                    track.shoutoutId = result.key;
                    trackName = track.name;
                    break;
                  }
                }
              }
            } else {
              // not coming from a playlist, likely using mic on search page
              // must find by track.id instead (not 100% guarantee since same track can exist across multiple playlists)
              for (let track of playlist.tracks) {
                if (shoutout.trackId === track.id) {
                  this.logger.debug('found track');
                  track.shoutoutId = result.key;
                  trackName = track.name;
                  updatedPlaylist = playlist;
                  break;
                }
              }
            }
          }   
       
          this.updatePlaylist(updatedPlaylist);
          if (!Config.SHOUTOUT_READY_SHOWN()) {
            setTimeout(() => {
              // this.logger.debug(`Path is now: ${this.location.path()}`);
              if (this.location.path() === '/home') {
                // on search page, let user know how to get to where their newly recorded shoutout is
                this.fancyalert.show(TextService.SPOTIFY_SHOUTOUT_READY(trackName, updatedPlaylist.name));
                Config.SET_SHOUTOUT_READY_SHOWN(true);
              }        
            }, 2000);
          }
        });
      })
    }
  }

  private updatePlaylist(playlist: PlaylistModel) {
    if (Config.USER_KEY && playlist) {
      if (!playlist.id) {
        this.logger.debug(`Tried updating playlist, but playlist.id was null or undefined`);
        this.track('FIREBASE_PLAYLIST_UPDATE_ERROR', { label: Config.USER_KEY });
        return;
      }
      this._ignoreUpdate = false;
      this.logger.debug(`About to update playlist...`);
      // for (let key in playlist) {
      //   this.logger.debug(`${key}: ${playlist[key]}`);
      // }
      let id = playlist.id;
      delete playlist.id; // don't store id since firebase uses it as key
      delete playlist.playing // never store playing state
      if (playlist.tracks) {
        for (let t of playlist.tracks) {
          delete t.playing // ignore playing state
        }
      }
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
      let playlistIds = []; // just for logging ids below
      for (let p of playlists) {
        let id = p.id;
        playlistIds.push(id);
        delete p.id; // firebase uses id as collection identifier so no need to store with object
        delete p.playing // never store playing state
        if (p.tracks) {
          for (let t of p.tracks) {
            delete t.playing // ignore playing state
          }
        }
        playlistsObject[id] = p;
      }   
      this.logger.debug(`Updating all playlists: ${playlistIds.join(',')}`);
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
      this.track(FIREBASE_ACTIONS.PLAYLIST_DELETED, { label: Config.USER_KEY });
      // TODO: loop through tracks and remove shoutouts attached to all the tracks.
      // OR: leave shoutouts but remove trackId and playlistId references in them
      // ^ would require the ability to add existing shoutouts to other tracks
    });
  }

  private deleteShoutout(shoutout: ShoutoutModel) {
    // this._ignoreUpdate = true;
    firebase.remove(
      `/users/${Config.USER_KEY}/shoutouts/${shoutout.id}`
    ).then((result: any) => {
      this.logger.debug(`Shoutout deleted.`);
      this.ngZone.run(() => {
        this.store.dispatch({ type: FIREBASE_ACTIONS.SHOUTOUT_DELETED, payload: shoutout });
      });  
      this.track(FIREBASE_ACTIONS.SHOUTOUT_DELETED, { label: Config.USER_KEY });
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
        // if (targetItem.id !== playlists[i].id) {
          this.logger.debug(`${playlists[i].name} - setting order: ${i}`);
          playlists[i].order = i;
        // }
      }
      this.updatePlaylists(playlists);
      this.track(FIREBASE_ACTIONS.REORDER, { label: 'Playlists' });
    });
  }

  private reorderTracks(data: any) {
    if (data.playlist) {
      // Using targetIndex here since RadListView binding is to array on playlist state so changed in view
      this.logger.debug(`Changing order of track: ${data.playlist.tracks[data.targetIndex].name}`);
      data.playlist.tracks[data.targetIndex].order = data.targetIndex;
      this.logger.debug(`Reordering tracks, setting order: ${data.targetIndex} of ${data.playlist.tracks.length} tracks.`);
      for (var i = 0; i < data.playlist.tracks.length; i++) {
        if (i !== data.targetIndex) {
          this.logger.debug(`${data.playlist.tracks[i].name} - setting order: ${i}`);
          data.playlist.tracks[i].order = i;
        }
      }
      this.updatePlaylist(data.playlist);
      this.track(FIREBASE_ACTIONS.REORDER, { label: 'Tracks' });
    }
  }

  private init() {
    this.state$ = this.store.select('firebase');
    this.store.select('auth').subscribe((s: IAuthState) => {
      if (s.loggedIn) {
        // try to log user in or create an account based on their spotify account
        TNSSpotifyAuth.CURRENT_USER().then((user: any) => {
          this.logger.debug(`Spotify user:`);
          let emailAddress = isIOS ? user.emailAddress : user.email;
          this.logger.debug(`email: ${emailAddress}`);
          this.logger.debug(`uri: ${user.uri}`);
          this.logger.debug(`product: ${user.product}`);
          this._spotifyUserProduct = user.product;
          this.track('SPOTIFY_LOGIN', { label: emailAddress, value: user.product });
          // for (let key in user) {
          //   this.logger.debug(key);
          //   this.logger.debug(user[key]);
          // }
          var login = () => {
            this.authenticate(emailAddress, emailAddress); // use emailAddress as part of password (uri not good cuz it can change)
          };
          if (emailAddress) {
            if (!this._firebaseUser) {
              // not previously logged in, go ahead and login
              login();
            } else if (this._firebaseUser.email !== emailAddress) {
              // log previously logged in user out, and login new user
              firebase.logout().then(() => {
                this.resetInitializers();
                login();
              });
            } else {
              // currently logged in via firebase, go ahead and process playlists
              this.store.take(1).subscribe((s: any) => {
                this.handleSpotifyPlaylists(s.firebase.playlists);
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
        this.track('SPOTIFY_LOGOUT', { label: this._firebaseUser.email });
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
      storageBucket: 'gs://shoutoutplay-d3392.appspot.com',// 'gs://shoutoutplay.appspot.com',
      // iOSEmulatorFlush: true,
      onAuthStateChanged: (data) => {
        // optional but useful to immediately re-logon the user when he re-visits your app
        this.logger.debug(`Logged ${data.loggedIn ? 'into' : 'out of'} firebase.`);
        if (data.loggedIn) {
          if (!this._firebaseUser) {
            let email = data.user.email ? data.user.email : 'N/A';
            this.logger.debug(`User's email address: ${email}`);
            this.logger.debug(`User's uid: ${data.user.uid}`);
            this._firebaseUser = <any>data.user;
            this.listenToUser(this._firebaseUser.uid);
            this.track('FIREBASE_LOGIN', { label: email });
          } 
        } else {
          this.resetInitializers();
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

        // used to maintain playing state when syncing with remote changes        
        let currentTrackId = s.player.currentTrackId;
        let isPlaying = s.player.playing;

        if (user.playlists) {
          for (let id in user.playlists) {
            let localPlayState = false;
            
            if (this._initialized && isPlaying) {
              // maintain playing state when syncing (only care after initialization)
              // this.logger.debug(`maintaining play state, finding playlist.id: ${id}`);
              let localPlaylist: any = find(s.firebase.playlists, { id: id });
              // this.logger.debug(`localPlaylist ----`);
              // this.logger.debug(localPlaylist);

              if (localPlaylist) {
                // since `playing` is not persisted, ensure local state is same when remote changes sync
                localPlayState = localPlaylist.playing;
                // this.logger.debug(`localPlaylist.playing:`);
                // this.logger.debug(localPlaylist.playing);
                if (localPlayState && currentTrackId) {
                  this.logger.debug('maintaining track playing state...')
                  // update track state
                  for (let trackId in user.playlists[id].tracks) {
                    if (user.playlists[id].tracks[trackId].id === currentTrackId) {
                      user.playlists[id].tracks[trackId].playing = true;
                      break;
                    }
                  }
                }
              }
            }
            let playlist = new PlaylistModel(Object.assign({ id: id }, user.playlists[id], { playing: localPlayState }));
            playlists.push(playlist);
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
          if (msg && this._spotifyUserProduct) {
            // only ever display msg if valid spotify user is logged in
            this.dialogs.success(msg);
          }
        } else {
          this._initialized = true;
          this.store.dispatch({ type: SHOUTOUT_ACTIONS.DOWNLOAD_SHOUTOUTS, payload: shoutouts });
        }

        this.handleSpotifyPlaylists(playlists);

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
      let emailLog = this._firebaseUser.email || '';
      if (emailLog && emailLog.length > 35) {
        emailLog = emailLog.substring(0, 35);
      }
      this.track('NEW_FIREBASE_USER', { label: emailLog });
      this.logger.debug(`creating new firebase user: ${this._firebaseUser.email}`);
      let newUser = new ShoutOutPlayUser({
        uid: this._firebaseUser.uid,
        email: this._firebaseUser.email,
        product: this._spotifyUserProduct
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

  private handleSpotifyPlaylists(playlists: Array<PlaylistModel>) {
    if (this._initialized && isIOS && !this._fetchedSpotifyPlaylists && (this._spotifyUserProduct == 1 || this._spotifyUserProduct == 2)) {
      // iOS supported only atm
      // TODO: implement in Android spotify lib
      this._fetchedSpotifyPlaylists = true;
      // only if premium or unlimited user
      this.fetchSpotifyPlaylists(playlists);
    }
  }

  private fetchSpotifyPlaylists(playlists: Array<PlaylistModel>) {
    TNSSpotifyPlaylist.MINE().then((result: any) => {
      console.log('fetched all user playlists:');
      console.log(result.playlists);
      console.log(result.playlists.length);
      let existingSpotifyPlaylists = playlists.filter(p => isString(p.spotifyUri) && p.spotifyUri.length > 0).map(p => p.spotifyUri);
      this.logger.debug(`${existingSpotifyPlaylists.length} existing playlists in firebase are from Spotify.`);
      let cnt = 0;

      // set order to the end of the current playlists
      // spotify playlists will add to the end
      let currentOrder = playlists.length; 

      let advance = () => {
        cnt++;
        currentOrder++; // tracks correct order for playlists
        if (cnt < result.playlists.length) {
          addPlaylist();
        } 
      };
      let addPlaylist = () => {
        let spotifyPlaylist = result.playlists[cnt];
        if (spotifyPlaylist.name === 'Discover Weekly' || spotifyPlaylist.name === 'Starred') {
          // ignore discover weekly and Starred (spotify creates that for users)
          advance();
        } else {
          if (includes(existingSpotifyPlaylists, spotifyPlaylist.uri)) {
            this.logger.debug(`Spotify playlist already exists in firebase, skipping.`);
            // already exists, skip and advance to next
            // TODO: instead of advancing, check for changes and update firebase
            this._ignoreUpdate = false; // reset before advancing in case it's last one
            advance();

            if (cnt === result.playlists.length) {
              // TODO: may need to manually fetch latest firebase playlists and manually dispatch state
              // could occur if this is last after creating new playlists before
              this.logger.debug('NOTE: if playlists are missing, this may need to be addressed.');
            }
          } else {

            if ((cnt + 1) === result.playlists.length) {
              // processing last playlist, allow state updates
              this._ignoreUpdate = false;
            } else {
              // disable state updates while processing
              this._ignoreUpdate = true;
            }
            
            let playlist = new PlaylistModel(spotifyPlaylist);
            playlist.order = currentOrder;
            this.addNewPlaylist(playlist).then(advance, advance);
          }
        }
      };
      if (result.playlists.length) {
        addPlaylist();
      }
    }, () => {
      this.logger.debug('User had no existing Spotify playlists.');
    });
  }

  private resetInitializers() {
    this._firebaseUser = undefined;
    this._spotifyUserProduct = undefined;
    this._fetchedSpotifyPlaylists = false;
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
      if (key === 'playing') {
        delete model[key];
      } else if (typeof model[key] === 'function') {
        console.log(`stripping function: ${key}`);
        delete model[key];
      }
    }
  }
}

@Injectable()
export class FirebaseEffects {
  constructor(private store: Store<any>, private logger: LogService, private actions$: Actions, private firebaseService: FirebaseService) { }
      
  @Effect() processUpdates$ = this.actions$
    .ofType(FIREBASE_ACTIONS.PROCESS_UPDATES)
    .do((action) => {
      this.logger.debug(`FirebaseEffects.PROCESS_UPDATES`);
      this.firebaseService.processUpdates(action.payload);
    })
    .filter(() => false);

  @Effect() create$ = this.actions$
    .ofType(FIREBASE_ACTIONS.CREATE)
    .do((action) => {
      this.logger.debug(`FirebaseEffects.CREATE`);
      this.firebaseService.addDocument(action.payload);
    })
    .filter(() => false);
  
  @Effect() createShoutout$ = this.actions$
    .ofType(FIREBASE_ACTIONS.CREATE_SHOUTOUT)
    .do((action) => {
      this.logger.debug(`FirebaseEffects.CREATE_SHOUTOUT`);
      this.firebaseService.addDocument(action.payload);
    })
    .filter(() => false);
  
  @Effect() delete$ = this.actions$
    .ofType(FIREBASE_ACTIONS.DELETE)
    .do((action) => {
      this.logger.debug(`FirebaseEffects.DELETE`);
      this.firebaseService.deleteDocument(action.payload);
    })
    .filter(() => false);
  
  @Effect() shoutoutDeleted$ = this.actions$
    .ofType(FIREBASE_ACTIONS.SHOUTOUT_DELETED)
    .do((action) => {
      this.logger.debug(`FirebaseEffects.SHOUTOUT_DELETED`);
      this.firebaseService.removeShoutoutFromTrack(action.payload);
    })
    .filter(() => false);
  
  @Effect() reorder$ = this.actions$
    .ofType(FIREBASE_ACTIONS.REORDER)
    .do((action) => {
      this.logger.debug(`FirebaseEffects.REORDER`);
      this.firebaseService.reorder(action.payload);
    })
    .filter(() => false);
  
  @Effect() deleteTrack$ = this.actions$
    .ofType(FIREBASE_ACTIONS.DELETE_TRACK)
    .map((action) => {
      this.logger.debug(`FirebaseEffects.DELETE_TRACK`);
      let updatedPlaylist;
      this.store.take(1).subscribe((s: any) => {
        let playlists = [...s.firebase.playlists];
        for (let playlist of playlists) {
          if (playlist.id === action.payload.playlistId) {
            updatedPlaylist = playlist;
            this.logger.debug(`Removing track...`);
            this.logger.debug(playlist.tracks.length);
            playlist.removeTrack(action.payload.track);
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
  
  @Effect() resetAccount$ = this.actions$
    .ofType(FIREBASE_ACTIONS.RESET_ACCOUNT)
    .do((action) => {
      this.logger.debug(`FirebaseEffects.RESET_ACCOUNT`);
      this.firebaseService.resetAccount();
    })
    .filter(() => false);
}