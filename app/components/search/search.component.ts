// angular
import {NgZone, ViewChild, OnDestroy, ElementRef, AfterViewInit, OnInit, ChangeDetectionStrategy} from '@angular/core';
import {Router} from '@angular/router';
import {Location} from '@angular/common';

// nativescript
import {ModalDialogService, ModalDialogOptions, ModalDialogHost} from "nativescript-angular/directives/dialogs";
import {screen, isIOS} from 'platform';
import {Animation} from 'ui/animation';
import {topmost} from 'ui/frame';
import {AnimationCurve} from 'ui/enums';

// libs
import {Store} from '@ngrx/store';
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {Subscription} from "rxjs/Subscription";
import 'rxjs/add/operator/take';

// app
import {BaseComponent, Config, LogService} from '../../shared/core/index';
import {SearchService, AuthService, IAuthState, PlaylistService, PLAYLIST_ACTIONS, TrackModel, EmptyComponent, CoachmarksService} from '../../shared/shoutoutplay/index';
import {PlaylistChooserComponent} from '../playlist/playlist-chooser.component';
import {IntegrationsComponent} from './integrations.component';

@BaseComponent({
  // moduleId: module.id,
  selector: 'search',
  templateUrl: './components/search/search.component.html',
  providers: [ModalDialogService]
})
export class SearchComponent implements AfterViewInit, OnInit, OnDestroy {
  @ViewChild('searchbar') searchBarEl: ElementRef;
  // TODO: potentially animate empty view
  // @ViewChild('emptyArrow') emptyArrowEl: ElementRef;
  // @ViewChild('emptyLabel') emptyLabelEl: ElementRef;
  private _loadingMore: boolean = false;
  private _sub: Subscription;
  private _sub2: Subscription;

  constructor(private store: Store<any>, private logger: LogService, public authService: AuthService, public searchService: SearchService, public playlistService: PlaylistService, private modal: ModalDialogService, private ngZone: NgZone, private router: Router, private loc: Location, private coachmarks: CoachmarksService) {
    logger.debug(`SearchComponent constructor`);
  }

  public search(e: any) {
    if (e && e.object) {
      this.logger.debug(e.object.text);
      this.searchService.search(e.object.text);
      this.dismissKeyboard();
    }
  }

  public loadMore(e: any) {
    if (!this._loadingMore) {
      this._loadingMore = true;
      this.searchService.searchMore();
      setTimeout(() => {
        // prevent multiple triggers
        this._loadingMore = false;
      }, 1000);
    }
  }

  public clear() {
    this.logger.debug('clear');
  }  

  public itemLoading(e: any) {
    if (isIOS) {
      e.ios.selectionStyle = UITableViewCellSelectionStyle.UITableViewCellSelectionStyleNone;
    }
  }

  private dismissKeyboard() {
    if (!isIOS) {
      setTimeout(() => {
        if (this.searchBarEl.nativeElement) {
          if (this.searchBarEl.nativeElement.android) {
            this.searchBarEl.nativeElement.android.clearFocus();
          } else if (this.searchBarEl.nativeElement.clearFocus) {
            this.searchBarEl.nativeElement.clearFocus();
          }
        }
        
        this.searchBarEl.nativeElement.dismissSoftInput();
      }, 400);
    }
  }

  ngOnInit() {
    this.logger.debug(`SearchComponent ngOnInit`);

    if (!Config.SEEN_INTRO()) {
      this.router.navigate(['/intro']);
    } else {
      // Config.SET_SEEN_INTRO(false);
      // HACK: search view doesn't render when showing to start
      // this.router.navigate(['/welcome']);
    }
      
    this._sub = this.playlistService.state$.subscribe((state: any) => {
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
      }
    });

    this._sub2 = this.playlistService.showRecord$.subscribe((track: TrackModel) => {
      if (track) {
        this.searchService.quickRecordTrack = track;
        this.router.navigate(['/record']);
      }   
    })
  }

  public requestIntegration() {
    let options: ModalDialogOptions = {
      context: { promptMsg: "This is the prompt message!" },
      fullscreen: false
    };
    this.modal.showModal(IntegrationsComponent, options).then((choices: any) => {
      if (choices) {
        this.logger.debug(choices);
        for (let key in choices) {
          this.logger.debug(`key: ${key}, ${choices[key]}`);
        }
        this.authService.sendRequests(choices);
      }
    });
  }

  ngAfterViewInit() {
    this.logger.debug(`SearchComponent ngAfterViewInit`);

    // coach marks
    this.logger.debug(this.searchBarEl);
    if (this.searchBarEl) {
      this.coachmarks.teachSearch(this.searchBarEl.nativeElement);

      this.dismissKeyboard();
    }
    
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
    if (this._sub) {
      this._sub.unsubscribe();
    }
    if (this._sub2) {
      this._sub2.unsubscribe();
    }
  }
}