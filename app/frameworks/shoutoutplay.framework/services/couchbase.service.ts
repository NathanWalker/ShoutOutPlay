// angular
import {Injectable} from 'angular2/core';

// libs
import {Store, Reducer, Action} from '@ngrx/store';
import {Observable} from 'rxjs/Rx';
import {Couchbase} from 'nativescript-couchbase';

// app
import {PlaylistModel, ShoutoutModel} from '../index';
import {LogService} from '../../core.framework/index';

// analytics
const CATEGORY: string = 'Couchbase';

/**
 * ngrx setup start --
 */
export interface CouchbaseStateI {
  playlists?: Array<PlaylistModel>,
  shoutouts?: Array<ShoutoutModel>
}

const initialState: CouchbaseStateI = {
  playlists: [],
  shoutouts: []
};

interface COUCHBASE_ACTIONSI {
  SAVE_PLAYLIST: string;
  SAVE_SHOUTOUT: string;
  UPDATE: string;
  DELETE_PLAYLIST: string;
  DELETE_SHOUTOUT: string;
}

export const COUCHBASE_ACTIONS: COUCHBASE_ACTIONSI = {
  SAVE_PLAYLIST: `[${CATEGORY}] SAVE_PLAYLIST`,
  SAVE_SHOUTOUT: `[${CATEGORY}] SAVE_SHOUTOUT`,
  UPDATE: `[${CATEGORY}] UPDATE`,
  DELETE_PLAYLIST: `[${CATEGORY}] DELETE_PLAYLIST`,
  DELETE_SHOUTOUT: `[${CATEGORY}] DELETE_SHOUTOUT`
};

export const couchbaseReducer: Reducer<CouchbaseStateI> = (state: CouchbaseStateI = initialState, action: Action) => {
  let changeState = () => {
    return Object.assign({}, state, action.payload);
  };
  switch (action.type) {
    case COUCHBASE_ACTIONS.SAVE_PLAYLIST:
      action.payload = { playlists: [...state.playlists, action.payload] };
      return changeState();
    case COUCHBASE_ACTIONS.SAVE_SHOUTOUT:
      action.payload = { shoutouts: [...state.shoutouts, action.payload] };
      return changeState();
    case COUCHBASE_ACTIONS.UPDATE:
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

  constructor(private store: Store<any>, private logger: LogService) {
    this.state$ = store.select('couchbase');

    this.init();   
  }

  private init() {
    // init couchbase db
    this.database = new Couchbase('shoutoutplay');

    this.database.createView('playlists', '1', (document, emitter) => {
      let doc = JSON.parse(document);
      if (doc.type === 'playlist') {
        let playlist = new PlaylistModel(doc);
        emitter.emit(playlist.id, playlist);
      }
    });

    this.database.createView('shoutouts', '1', (document, emitter) => {
      let doc = JSON.parse(document);
      if (doc.type === 'shoutout') {
        let shoutout = new ShoutoutModel(doc);
        emitter.emit(shoutout.id, shoutout);
      }
    });

    // react to database changes    
    this.setupChangeHandler();

    // restore state from couchbase    
    // let playlists = [];
    // let shoutouts = [];

    let rows = this.database.executeQuery('playlists');
    this.logger.debug(`executeQuery('playlists')`);
    this.logger.debug(typeof rows);
    this.logger.debug(rows);
    for (let i in rows) {
      this.logger.debug(i);
      if (rows.hasOwnProperty(i)) {
        this.logger.debug(rows[i]);
        // playlists.push(rows[i]);
      }
    }

    rows = this.database.executeQuery('shoutouts');
    this.logger.debug(`executeQuery('shoutouts')`);
    for (let i in rows) {
      this.logger.debug(i);
      if (rows.hasOwnProperty(i)) {
        this.logger.debug(rows[i]);
        // shoutouts.push(rows[i]);
      }
    }

    // this.store.dispatch({ type: COUCHBASE_ACTIONS.UPDATE, payload: { playlists, shoutouts } });
  }

  private setupChangeHandler() {
    this.database.addDatabaseChangeListener((changes) => {
      this.logger.debug('Changes occured, firing addDatabaseChangeListener ---');
      this.logger.debug(changes);

      // used to process changes before dispatching to store      
      let rawPlaylists = this.store.getState().couchbase.playlists;
      let rawShoutouts = this.store.getState().couchbase.shoutouts;
      
      for (let change of changes) {
        this.logger.debug(change);

        // this should be the underlying record https://github.com/couchbaselabs/nativescript-couchbase/blob/master/couchbase.ios.ts#L194
        this.logger.debug(change.change); 
        
        let documentId = change.getDocumentId();
        let document = this.database.getDocument(documentId);

        // update or insert document
        this.changeHandler(document, rawPlaylists, rawShoutouts);
      }

      this.store.dispatch({ type: COUCHBASE_ACTIONS.UPDATE, payload: { playlists: rawPlaylists, shoutouts: rawShoutouts } });
    });
  }

  private changeHandler(document: any, playlists: Array<PlaylistModel>, shoutouts: Array<ShoutoutModel>) {
    // TODO: modify
    this.logger.debug(document);
    

  }
}