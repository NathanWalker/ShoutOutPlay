// angular
import {Injectable} from '@angular/core';

// libs
import {Store, ActionReducer, Action} from '@ngrx/store';
import {Observable} from 'rxjs/Observable';
import {Couchbase} from 'nativescript-couchbase';
import 'rxjs/add/operator/take';

// app
import {PlaylistModel, ShoutoutModel} from '../index';
import {LogService, DialogsService} from '../../core.framework/index';

// analytics
const CATEGORY: string = 'Couchbase';

declare var MBProgressHUDModeCustomView: any;

/**
 * ngrx setup start --
 */
export interface CouchbaseStateI {
  playlists?: Array<PlaylistModel>,
  shoutouts?: Array<ShoutoutModel>,
  newPlaylist?: PlaylistModel
}

const initialState: CouchbaseStateI = {
  playlists: [],
  shoutouts: []
};

interface COUCHBASE_ACTIONSI {
  CREATE_PLAYLIST: string;
  UPDATE: string;
  DELETE_PLAYLIST: string;
  DELETE_SHOUTOUT: string;
}

export const COUCHBASE_ACTIONS: COUCHBASE_ACTIONSI = {
  CREATE_PLAYLIST: `[${CATEGORY}] CREATE_PLAYLIST`,
  UPDATE: `[${CATEGORY}] UPDATE`,
  DELETE_PLAYLIST: `[${CATEGORY}] DELETE_PLAYLIST`,
  DELETE_SHOUTOUT: `[${CATEGORY}] DELETE_SHOUTOUT`
};

export const couchbaseReducer: ActionReducer<CouchbaseStateI> = (state: CouchbaseStateI = initialState, action: Action) => {
  let changeState = () => {
    return Object.assign({}, state, action.payload);
  };
  switch (action.type) {
    case COUCHBASE_ACTIONS.CREATE_PLAYLIST:
      action.payload = { newPlaylist: action.payload };
      return changeState();
    case COUCHBASE_ACTIONS.UPDATE:
      // always reset when updating state
      action.payload.newPlaylist = undefined;
      return changeState();
    case COUCHBASE_ACTIONS.DELETE_PLAYLIST:
      action.payload = { playlists: state.playlists.filter((playlist: PlaylistModel) => playlist.id !== action.payload) };
      return changeState();
    case COUCHBASE_ACTIONS.DELETE_SHOUTOUT:
      action.payload = { shoutouts: state.shoutouts.filter((shoutout: ShoutoutModel) => shoutout.id !== action.payload) };
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
  public state$: Observable<any>;
  private database: Couchbase;

  constructor(private store: Store<any>, private logger: LogService, private dialogs: DialogsService) {
    this.state$ = store.select('couchbase');
    this.state$.subscribe((couchbase: CouchbaseStateI) => {
      if (couchbase.newPlaylist) {
        // creating a new playlist
        this.addDocument(couchbase.newPlaylist);
      }
    });
    
    this.init();   
  }

  private init() {
    // init couchbase db
    this.database = new Couchbase('shoutoutplay');

    this.database.createView('playlists', '1', (document, emitter) => {
      let doc = JSON.parse(document);
      if (doc.type === 'playlist') {
        emitter.emit(doc._id, document);
      }
    });

    this.database.createView('shoutouts', '1', (document, emitter) => {
      let doc = JSON.parse(document);
      if (doc.type === 'shoutout') {
        emitter.emit(doc._id, document);
      }
    });

    // react to database changes    
    this.setupChangeHandler();

    // restore state from couchbase    
    let playlists = [];
    let shoutouts = [];

    let rows = this.database.executeQuery('playlists');
    for (let row of rows) {
      playlists.push(new PlaylistModel(JSON.parse(row)));
    }

    rows = this.database.executeQuery('shoutouts');
    for (let row of rows) {
      shoutouts.push(new ShoutoutModel(JSON.parse(row)));
    }

    this.store.dispatch({ type: COUCHBASE_ACTIONS.UPDATE, payload: { playlists, shoutouts } });
  }

  private setupChangeHandler() {
    this.database.addDatabaseChangeListener((changes) => {
      this.logger.debug('Changes occured, addDatabaseChangeListener ---');
      this.logger.debug(changes);

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
          let document = this.database.getDocument(documentId);

          // update or insert document
          this.changeHandler(document, playlists, shoutouts);
        }

        let msg = (playlists.length > startingCnt.playlists || shoutouts.length > startingCnt.shoutouts) ? 'Saved' : 'Updated';
        this.dialogs.success(msg);
        
        this.store.dispatch({ type: COUCHBASE_ACTIONS.UPDATE, payload: { playlists, shoutouts } });
      });
    });
  }

  private changeHandler(document: any, playlists: Array<PlaylistModel>, shoutouts: Array<ShoutoutModel>) {
    switch (document.type) {
      case 'playlist':
        var index = playlists.findIndex(playlist => playlist.id === document._id);
        if (index > -1) {
          // update
          playlists[index] = new PlaylistModel(document);
        } else {
          playlists.push(new PlaylistModel(document));
        }
        break;
      case 'shoutout':
        var index = shoutouts.findIndex(shoutout => shoutout.id === document._id);
        if (index > -1) {
          // update
          shoutouts[index] = new ShoutoutModel(document);
        } else {
          shoutouts.push(new ShoutoutModel(document));
        }
        break;
    }
  }

  private addDocument(model: PlaylistModel | ShoutoutModel) {
    this.database.createDocument(model);
  }
}