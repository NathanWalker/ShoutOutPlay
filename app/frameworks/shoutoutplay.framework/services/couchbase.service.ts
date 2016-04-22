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
      emitter.emit(JSON.parse(document)._id, document);
    });

    this.database.createView('shoutouts', '1', (document, emitter) => {
      emitter.emit(JSON.parse(document)._id, document);
    });

    this.database.addDatabaseChangeListener((changes) => {
      this.logger.debug(changes);

      var changeIndex = -1;
      for (let change of changes) {
        
        let documentId = change.getDocumentId();
        // changeIndex = this.indexOfObjectId(documentId, this.personList);
        let document = this.database.getDocument(documentId);
        this.logger.debug(document);

        if (changeIndex == -1) {
          // this.personList.push(document);
        } else {
          // this.personList.setItem(changeIndex, document);
        }
      }
    });

    this.refresh();


    // let playlists = [];
    // let shoutouts = [];
    // this.store.dispatch({ type: COUCHBASE_ACTIONS.UPDATE, payload: { playlists, shoutouts } });
  }

  private refresh() {
    var rows = this.database.executeQuery('playlists');
    this.logger.debug(`executeQuery('playlists')`);
    this.logger.debug(typeof rows);
    this.logger.debug(rows);
    for (var i in rows) {
      this.logger.debug(i);
      if (rows.hasOwnProperty(i)) {
        this.logger.debug(rows[i]);
        // this.personList.push(JSON.parse(rows[i]));
      }
    }

    rows = this.database.executeQuery('shoutouts');
    this.logger.debug(`executeQuery('shoutouts')`);
    for (var i in rows) {
      this.logger.debug(i);
      if (rows.hasOwnProperty(i)) {
        this.logger.debug(rows[i]);
        // this.personList.push(JSON.parse(rows[i]));
      }
    }
  }

  private indexOfObjectId(needle, haystack) {
    for (var i = 0; i < haystack.length; i++) {
      if (haystack.getItem(i) !== undefined && haystack.getItem(i).hasOwnProperty('_id')) {
        if (haystack.getItem(i)._id === needle) {
          return i;
        }
      }
    }
    return -1;
  }
}