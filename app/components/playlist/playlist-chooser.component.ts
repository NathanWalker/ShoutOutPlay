// libs
import {Store} from '@ngrx/store';
import {ModalDialogParams} from "nativescript-angular/directives/dialogs";

// app
import {LogService, BaseComponent} from '../../frameworks/core.framework/index';
import {PlaylistService, PlaylistStateI, PlaylistModel, PLAYER_ACTIONS, COUCHBASE_ACTIONS, CouchbaseService} from '../../frameworks/shoutoutplay.framework/index';

@BaseComponent({
  moduleId: module.id,
  selector: 'playlist-chooser',
  templateUrl: `playlist-chooser.component.html`
})
export class PlaylistChooserComponent {
  
  constructor(private store: Store<any>, private logger: LogService, public playlistService: PlaylistService, private couchbaseService: CouchbaseService, private params: ModalDialogParams) {
  } 

  public close() {
    this.params.closeCallback();
  }

  public choose(e: any) {
    this.store.take(1).subscribe((s: any) => {
      this.playlistService.addTrackTo(s.couchbase.playlists[e.index].id);
      this.close();
    });
  }
}