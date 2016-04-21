// angular
import {ChangeDetectionStrategy} from 'angular2/core';

// libs
import {Store} from '@ngrx/store';

// app
import {BaseComponent, LogService} from '../../frameworks/core.framework/index';
import {SearchService, AuthService, AuthStateI, PlaylistService} from '../../frameworks/shoutoutplay.framework/index';

@BaseComponent({
  selector: 'search',
  templateUrl: `./components/search/search.component.html`,
  changeDetection: ChangeDetectionStrategy.Default
})
export class SearchComponent {
  
  constructor(private store: Store<any>, private logger: LogService, public authService: AuthService, public searchService: SearchService, public playlistService: PlaylistService) {}

  public search(e: any) {
    if (e && e.object) {
      this.logger.debug(e.object.text);
      this.searchService.search(e.object.text);
    }
  }
  
  public toggleMenu() {
    this.logger.debug('test');
  }

  public clear() {
    this.logger.debug('clear');
  }  
}