// angular
import {NgZone, ViewChild, OnDestroy, ElementRef, AfterViewInit} from '@angular/core';
import {Router} from '@angular/router';

// nativescript
import {ModalDialogService, ModalDialogHost, ModalDialogOptions} from "nativescript-angular/directives/dialogs";
import {screen} from 'platform';
import {Animation} from 'ui/animation';
import {topmost} from 'ui/frame';
import {AnimationCurve} from 'ui/enums';

// libs
import {Store} from '@ngrx/store';
import {BehaviorSubject} from "rxjs/BehaviorSubject";

// app
import {BaseComponent, CoreConfigService, LogService} from '../../frameworks/core.framework/index';
import {SearchService, AuthService, AuthStateI, PlaylistService, PLAYLIST_ACTIONS, TrackModel, EmptyComponent} from '../../frameworks/shoutoutplay.framework/index';
import {PlaylistChooserComponent} from '../playlist/playlist-chooser.component';

@BaseComponent({
  moduleId: module.id,
  selector: 'search',
  templateUrl: `search.component.html`,
  directives: [ModalDialogHost, EmptyComponent],
  providers: [ModalDialogService]
})
export class SearchComponent implements AfterViewInit, OnDestroy {
  // TODO: potentially animate empty view
  // @ViewChild('emptyArrow') emptyArrowEl: ElementRef;
  // @ViewChild('emptyLabel') emptyLabelEl: ElementRef;

  constructor(private store: Store<any>, private logger: LogService, public authService: AuthService, public searchService: SearchService, public playlistService: PlaylistService, private modal: ModalDialogService, private ngZone: NgZone, private _router: Router) {
    if (!CoreConfigService.SEEN_INTRO()) {
      this._router.navigate(['/intro']);
    } else {
      CoreConfigService.SET_SEEN_INTRO(false);
      this._router.navigate(['/']);
    }
      
    playlistService.state$.subscribe((state: any) => {
      if (state.showPicker) {
        this.ngZone.run(() => {
          this.logger.debug(`SearchComponent trying to show modal: PlaylistChooserComponent`);
          let options: ModalDialogOptions = {
            context: { promptMsg: "This is the prompt message!" },
            fullscreen: false
          };
          this.modal.showModal(PlaylistChooserComponent, options).then((res: string) => {
            this.store.dispatch({ type: PLAYLIST_ACTIONS.CLOSE_PICKER });
          });
        });
      
      } else if (state.showRecord) {
        this._router.navigate(['/record']);
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

  public itemLoading(e: any) {
    e.ios.selectionStyle = UITableViewCellSelectionStyle.UITableViewCellSelectionStyleNone;
  }

  ngAfterViewInit() {
    // let emptyArrow = this.emptyArrowEl.nativeElement;
    // let emptyLabel = this.emptyLabelEl.nativeElement;

    // let animateDefs = [];
    // animateDefs.push({
    //   target: this.emptyArrow,
    //   translate: { x: 0, y: 0 },
    //   opacity: 0,
    //   duration: 1
    // });
    // animateDefs.push({
    //   target: emptyLabel,
    //   translate: { x: 0, y: 0 },
    //   opacity: 0,
    //   duration: 1
    // });
    // let animateSet = new Animation(animateDefs);
    // animateSet.play();
    // setTimeout(() => {
    //   animateDefs = [];
    //   animateDefs.push({
    //     target: emptyArrow,
    //     translate: { x: 0, y: 100 },
    //     opacity: 1,
    //     duration: 1000,
    //     curve: AnimationCurve.spring
    //   });
    //   animateDefs.push({
    //     target: emptyLabel,
    //     translate: { x: 0, y: 300 },
    //     opacity: 1,
    //     duration: 2000,
    //     curve: AnimationCurve.spring
    //   });
    //   animateSet = new Animation(animateDefs);
    //   animateSet.play().then(() => {
    //     // nothing
    //   }, () => {
    //     // stopped
    //   }).catch((e) => {
    //     this.logger.debug(`_startAnimateSet error: ${e.message}`);
    //   });
    // }, 600);
  }

  ngOnDestroy() {
    this.logger.debug(`SearchComponent ngOnDestroy...`);
  }
}