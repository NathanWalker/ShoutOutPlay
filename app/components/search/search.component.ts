// nativescript
import {ModalDialogService, ModalDialogHost, ModalDialogOptions} from "nativescript-angular/directives/dialogs";

// libs
import {Store} from '@ngrx/store';

// app
import {BaseComponent, LogService} from '../../frameworks/core.framework/index';
import {SearchService, AuthService, AuthStateI, PlaylistService, PLAYLIST_ACTIONS} from '../../frameworks/shoutoutplay.framework/index';
import {PlaylistChooserComponent} from '../playlist/playlist-chooser.component';

@BaseComponent({
  selector: 'search',
  templateUrl: `./components/search/search.component.html`,
  directives: [ModalDialogHost]
})
export class SearchComponent {
  
  constructor(private store: Store<any>, private logger: LogService, public authService: AuthService, public searchService: SearchService, public playlistService: PlaylistService, private modal: ModalDialogService) {
    playlistService.state$.subscribe((state: any) => {
      if (state.showPicker) {
        let options: ModalDialogOptions = {
            context: { promptMsg: "This is the prompt message!" },
            fullscreen: false
        };
        this.modal.showModal(PlaylistChooserComponent, options).then((res: string) => {
          this.store.dispatch({ type: PLAYLIST_ACTIONS.CLOSE_PICKER });
        });
      }
    });
  }

  public search(e: any) {
    if (e && e.object) {
      this.logger.debug(e.object.text);
      this.searchService.search(e.object.text);
    }
  }

  public clear() {
    this.logger.debug('clear');
  }  
}