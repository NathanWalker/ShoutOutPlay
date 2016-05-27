// angular
import {Component} from '@angular/core';

// libs
import {Store} from '@ngrx/store';
import {ModalDialogParams} from "nativescript-angular/directives/dialogs";

// app
import {LogService, BaseComponent} from '../../frameworks/core.framework/index';
import {PlaylistService, PlaylistStateI, PlaylistModel, PLAYER_ACTIONS, COUCHBASE_ACTIONS} from '../../frameworks/shoutoutplay.framework/index';

@Component({
  selector: 'playlist-chooser',
  templateUrl: `./components/playlist/playlist-chooser.component.html`
})
export class PlaylistChooserComponent {
  
  constructor(private store: Store<any>, private logger: LogService, public playlistService: PlaylistService, private params: ModalDialogParams) {
    logger.debug(`PlaylistChooserComponent`);
  } 

  public close() {
    this.params.closeCallback();
  }

  public choose(e: any) {
    this.store.take(1).subscribe((s: any) => {
      this.playlistService.addTrackTo(s.playlist.list[e.index].id);
      this.close();
    });
  }
}