// angular
import {Component} from 'angular2/core';

// app
import {LogService, BaseComponent} from '../../frameworks/core.framework/index';
import {PlaylistService, PlaylistStateI, PlaylistModel} from '../../frameworks/shoutoutplay.framework/index';

@BaseComponent({
  selector: 'playlist',
  templateUrl: `./components/playlist/playlist.component.html`
})
export class PlaylistComponent {

  constructor(private logger: LogService, public playlistService: PlaylistService) {
    playlistService.state$.subscribe((state: PlaylistStateI) => {
      this.logger.debug(`playlists:`);
      this.logger.debug(state.list);
    });
  }

  public viewDetail(playlist: PlaylistModel) {
    this.logger.debug(`TODO: show detail for: ${playlist.name}`);
  }

  public add() {
    this.logger.debug('add');
  }  
}