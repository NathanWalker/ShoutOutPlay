// angular
import {Component} from '@angular/core';

// libs
import {Store} from '@ngrx/store';

// app
import {LogService, BaseComponent} from '../../frameworks/core.framework/index';
import {PlaylistService, PlaylistStateI, PlaylistModel, PLAYLIST_ACTIONS} from '../../frameworks/shoutoutplay.framework/index';

@BaseComponent({
  selector: 'playlist',
  templateUrl: `./components/playlist/playlist.component.html`
})
export class PlaylistComponent {

  constructor(private store: Store<any>, private logger: LogService, public playlistService: PlaylistService) {

  }

  public viewDetail(e: any) {
    // this.logger.debug(e);
    let playlist = this.store.getState().playlist.list[e.index];
    this.store.dispatch({ type: PLAYLIST_ACTIONS.SELECT, payload: playlist });
  }

  public add() {
    this.logger.debug('add');
  }  
}