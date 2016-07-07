// angular
import {Injectable, NgZone} from '@angular/core';

// nativescript
import {Couchbase} from 'nativescript-couchbase';

// libs
import {Store, ActionReducer, Action} from '@ngrx/store';
import {Effect, toPayload, StateUpdates} from '@ngrx/effects';
import {Observable} from 'rxjs/Observable';
import * as _ from 'lodash';

// app
import {PlaylistModel, ShoutoutModel} from '../index';
import {LogService, DialogsService} from '../../core.framework/index';

// analytics
const CATEGORY: string = 'Couchbase';

declare var MBProgressHUDModeCustomView: any;
declare var zonedCallback: Function;

/**
 * ngrx setup start --
 */
export interface CouchbaseChangesI {
  playlists?: Array<PlaylistModel>;
  shoutouts?: Array<ShoutoutModel>;
}
export interface CouchbaseStateI {
  playlists?: Array<PlaylistModel>;
  shoutouts?: Array<ShoutoutModel>;
  selectedPlaylistId?: string;
  selecting?: boolean;
}

const initialState: CouchbaseStateI = {
  playlists: [],
  shoutouts: []
};

interface COUCHBASE_ACTIONSI {
  CREATE: string;
  UPDATE: string;
  UPDATE_PLAYLIST: string;
  PROCESS_UPDATES: string;
  DELETE: string;
  DELETE_TRACK: string;
  SELECT_PLAYLIST: string;
  RESET_PLAYLISTS: string;
}

export const COUCHBASE_ACTIONS: COUCHBASE_ACTIONSI = {
  CREATE: `[${CATEGORY}] CREATE`,
  UPDATE: `[${CATEGORY}] UPDATE`,
  UPDATE_PLAYLIST: `[${CATEGORY}] UPDATE_PLAYLIST`,
  PROCESS_UPDATES: `[${CATEGORY}] PROCESS_UPDATES`,
  DELETE: `[${CATEGORY}] DELETE`,
  DELETE_TRACK: `[${CATEGORY}] DELETE_TRACK`,
  SELECT_PLAYLIST: `[${CATEGORY}] SELECT_PLAYLIST`,
  RESET_PLAYLISTS: `[${CATEGORY}] RESET_PLAYLISTS`
};

export const couchbaseReducer: ActionReducer<CouchbaseStateI> = (state: CouchbaseStateI = initialState, action: Action) => {
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
    case COUCHBASE_ACTIONS.UPDATE:
      return changeState();
    case COUCHBASE_ACTIONS.UPDATE_PLAYLIST:
      var playlists = [...state.playlists];
      for (let playlist of playlists) {
        if (playlist.id === action.payload.id) {
          playlist = action.payload;
          break;
        }
      }
      action.payload = { playlists };
      return changeState();
    case COUCHBASE_ACTIONS.RESET_PLAYLISTS:
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

@Injectable()
export class CouchbaseService {
  public state$: Observable<CouchbaseStateI>;
  private database: Couchbase;
  // used to control simulataneous db changes
  private _queuedDocumentChanges: Array<any>;
  private _changeTimer: number;

  constructor(private store: Store<any>, private logger: LogService, private dialogs: DialogsService, private ngZone: NgZone) {
    this.state$ = store.select('couchbase');
    this.init();   
  }

  private init() {
    // init couchbase db
    this.database = new Couchbase('shoutoutplay');
    
    this.database.createView('playlists', '2', (document, emitter) => {
      if (document.type === 'playlist') {
        emitter.emit(document._id, document);
      }
    });

    this.database.createView('shoutouts', '2', (document, emitter) => {
      if (document.type === 'shoutout') {
        emitter.emit(document._id, document);
      }
    });

    // react to database changes    
    this.setupChangeHandler();

    // restore state from couchbase    
    let playlists = [];
    let shoutouts = [];

    let rows = this.database.executeQuery('playlists');
    for (let row of rows) {
      let playlist = new PlaylistModel(row);
      playlist.playing = false;
      // ensuring state is reset
      for (let track of playlist.tracks) {
        track.playing = false;
      }
      playlists.push(playlist);
    }

    rows = this.database.executeQuery('shoutouts');
    for (let row of rows) {
      shoutouts.push(new ShoutoutModel(row));
    }

    this.store.dispatch({ type: COUCHBASE_ACTIONS.UPDATE, payload: { playlists, shoutouts } });
  }

  private setupChangeHandler() {
    this.database.addDatabaseChangeListener(zonedCallback((changes) => {
      this.logger.debug('Changes occured, addDatabaseChangeListener ---');
      this.logger.debug(changes);
      if (!this._queuedDocumentChanges) {
        this._queuedDocumentChanges = [];
      }

      // used to process changes before dispatching to store      
      // when grabbing raw state, make sure it's a copy as to not accidentally mutate it
      this.store.take(1).subscribe((s: any) => {
        let playlists = [...s.couchbase.playlists];
        let shoutouts = [...s.couchbase.shoutouts];
        let startingCnt = {
          playlists: playlists.length,
          shoutouts: shoutouts.length
        }
        
        for (let change of changes) {
          
          let documentId = change.getDocumentId();
          this.logger.debug(documentId);
          let document = this.database.getDocument(documentId);
          // this.logger.debug('this.database.getDocument(documentId):');
          // this.logger.debug(JSON.stringify(document));
          // if document is null, it was deleted, just push in the id
          this._queuedDocumentChanges.push(document ? document : documentId);
        }

        if (this._changeTimer) {
          clearTimeout(this._changeTimer);
        }        
        this._changeTimer = setTimeout(() => {
          this.finalizeChanges(startingCnt, playlists, shoutouts);
        }, 800);        
      });
    }));
  }

  private finalizeChanges(startingCnt: any, playlists: Array<PlaylistModel>, shoutouts: Array<ShoutoutModel>) {
    this.logger.debug(`finalizing final changes...`);
    // flush state queue first
    for (let document of this._queuedDocumentChanges) {
      if (_.isObject(document) && document.type) {
        this.logger.debug('create/update');
        // update or insert document
        this.changeHandler(document, playlists, shoutouts);
      } else if (_.isString(document)) {
        // deleted document
        this.logger.debug('delete');
        this.deleteHandler(document, playlists, shoutouts);
      }
    }

    this._queuedDocumentChanges = undefined;    
    this._changeTimer = undefined;
    let msg;        
    if (playlists.length < startingCnt.playlists || shoutouts.length < startingCnt.shoutouts) {
      msg = 'Deleted';
    } else if (playlists.length > startingCnt.playlists || shoutouts.length > startingCnt.shoutouts) {
      msg =  'Saved';
    }
    if (msg) {
      this.dialogs.success(msg);
    }

    this.ngZone.run(() => {
      this.logger.debug(`ngZone running Couchbase Updates...`);
      this.logger.debug(`playlists.length: ${playlists.length}`);
      this.logger.debug(`shoutouts.length: ${shoutouts.length}`);
      this.store.dispatch({ type: COUCHBASE_ACTIONS.UPDATE, payload: { playlists, shoutouts } });
    });
  }

  private changeHandler(document: any, playlists: Array<PlaylistModel>, shoutouts: Array<ShoutoutModel>) {
    this.logger.debug(`changeHandler`);
    this.logger.debug(document.type);
    switch (document.type) {
      case 'playlist':
        var index = (<any>playlists).findIndex(playlist => playlist.id === document._id);
        this.logger.debug(index);
        if (index > -1) {
          // update
          playlists[index] = new PlaylistModel(document);
        } else {
          this.logger.debug('insert new playlist');
          playlists.push(new PlaylistModel(document));
        }
        break;
      case 'shoutout':
        var index = (<any>shoutouts).findIndex(shoutout => shoutout.id === document._id);
        if (index > -1) {
          // update
          shoutouts[index] = new ShoutoutModel(document);
        } else {
          shoutouts.push(new ShoutoutModel(document));
        }
        break;
    }
  }

  private deleteHandler(documentId: any, playlists: Array<PlaylistModel>, shoutouts: Array<ShoutoutModel>) {
    let index = -1;
    for (let i = 0; i < playlists.length; i++) {
      if (documentId === playlists[i].id) {
        index = i;
        break;
      }
    }
    this.logger.debug(`deleteHandler playlist index:`);
    this.logger.debug(index);
    if (index > -1) {
      playlists.splice(index, 1);
    } else {
      for (let i = 0; i < shoutouts.length; i++) {
        if (documentId === shoutouts[i].id) {
          index = i;
          break;
        }
      }
      this.logger.debug(`deleteHandler shoutout index:`);
      this.logger.debug(index);
      if (index > -1) {
        shoutouts.splice(index, 1);
      }
    }
  }

  public addDocument(model: PlaylistModel | ShoutoutModel) {
    this.logger.debug(`addDocument`);
    this.logger.debug(model.type);
    this.stripFunctions(model);
    this.database.createDocument(model);
  }

  public updateDocument(model: PlaylistModel | ShoutoutModel) {
    this.logger.debug(`updateDocument`);
    this.logger.debug(model.type);
    this.logger.debug(model.id);
    this.stripFunctions(model);
    this.database.updateDocument(model.id, model);
  }

  public deleteDocument(model: PlaylistModel | ShoutoutModel) {
    this.logger.debug(`deleteDocument`);
    this.logger.debug(model.type);
    this.database.deleteDocument(model.id);
  }

  public processUpdates(changes: CouchbaseChangesI) {
    this.logger.debug(`Couchbase.service processUpdates`);
    for (let key in changes) {
      this.logger.debug(`changes: ${key}`);
    }
    if (changes.playlists) {
      for (let playlist of changes.playlists) {
        this.logger.debug(`playlistId: ${playlist.id}`);
        if (playlist.queueDelete) {
          this.deleteDocument(playlist);
        } else if (playlist.id) {
          this.updateDocument(playlist);
        } else {
          this.addDocument(playlist);
        }
      }
    }
    if (changes.shoutouts) {
      for (let shoutout of changes.shoutouts) {
        if (shoutout.queueDelete) {
          this.deleteDocument(shoutout);
        } else if (shoutout.id) {
          this.updateDocument(shoutout);
        } else {
          this.addDocument(shoutout);
        }
      }
    }
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
export class CouchbaseEffects {
  constructor(private store: Store<any>, private logger: LogService, private updates$: StateUpdates<any>, private couchbaseService: CouchbaseService) { }
      
  @Effect() processUpdates$ = this.updates$
    .whenAction(COUCHBASE_ACTIONS.PROCESS_UPDATES)
    .do((update) => {
      this.logger.debug(`CouchbaseEffects.PROCESS_UPDATES`);
      this.couchbaseService.processUpdates(update.action.payload.changes);
    })
    .filter(() => false);

  @Effect() create$ = this.updates$
    .whenAction(COUCHBASE_ACTIONS.CREATE)
    .do((update) => {
      this.logger.debug(`CouchbaseEffects.CREATE`);
      this.couchbaseService.addDocument(update.action.payload);
    })
    .filter(() => false);
  
  @Effect() delete$ = this.updates$
    .whenAction(COUCHBASE_ACTIONS.DELETE)
    .do((update) => {
      this.logger.debug(`CouchbaseEffects.DELETE`);
      this.couchbaseService.deleteDocument(update.action.payload);
    })
    .filter(() => false);
  
  @Effect() deleteTrack$ = this.updates$
    .whenAction(COUCHBASE_ACTIONS.DELETE_TRACK)
    .map((update) => {
      this.logger.debug(`CouchbaseEffects.DELETE_TRACK`);
      let playlists = [];
      this.store.take(1).subscribe((s: any) => {
        playlists = [...s.couchbase.playlists];
        for (let playlist of playlists) {
          if (playlist.id === update.action.payload.playlistId) {
            this.logger.debug(`Removing track...`);
            this.logger.debug(playlist.tracks.length);
            playlist.removeTrack(update.action.payload.track);
            this.logger.debug(playlist.tracks.length);
            break;
          }
        }
      });
      return ({
        type: COUCHBASE_ACTIONS.PROCESS_UPDATES,
        payload: {
          changes: {
            playlists
          }
        }
      });
    });
}