// angular
import {Component} from '@angular/core';

// libs
import {Store} from '@ngrx/store';

// app
import {LogService, BaseComponent} from '../../frameworks/core.framework/index';
import {PlaylistService, PlaylistStateI, PlaylistModel, PLAYER_ACTIONS, PLAYLIST_ACTIONS} from '../../frameworks/shoutoutplay.framework/index';

@BaseComponent({
  selector: 'playlist-detail',
  templateUrl: `./components/playlist/playlist-detail.component.html`
})
export class PlaylistDetailComponent {
  
  constructor(private store: Store<any>, private logger: LogService, public playlistService: PlaylistService) {

  } 

  public togglePlay(trackId: string) {
    this.store.dispatch({ type: PLAYER_ACTIONS.TOGGLE_PLAY, payload: { currentTrackId: trackId } }); 
  }

  public edit() {
    // TODO: open dialog to change playlist name
  }
}