import { Component } from '@angular/core';

import {Store} from '@ngrx/store';
import 'rxjs/add/operator/take';

import { DrawerService, FancyAlertService, LogService } from '../../core/index';
import { AuthService } from '../services/auth.service';
import { PlaylistModel } from '../models/playlist.model';
import { FIREBASE_ACTIONS } from '../services/firebase.service';

@Component({
  // moduleId: module.id,
  selector: 'PlaylistActionBar',
  templateUrl: './shared/shoutoutplay/components/playlist-actionbar.component.html'
})
export class PlaylistActionBarComponent {

  constructor(public drawerService: DrawerService, public authService: AuthService, private fancyalert: FancyAlertService, private logger: LogService, private store: Store<any>) {

  }

  public add() {
    this.fancyalert.prompt('Name', '', 'Add New Playlist...', 'plus', (value: any) => {
      this.logger.debug(`Creating playlist named '${value}'`);
      let newPlaylist = new PlaylistModel({ name: value });
      this.store.take(1).subscribe((s: any) => {
        newPlaylist.order = s.firebase.playlists.length;
        this.store.dispatch({ type: FIREBASE_ACTIONS.CREATE, payload: newPlaylist });
      });
    });
  } 
}