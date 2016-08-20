// angular
import {Component, OnDestroy, ViewChild, ElementRef, AfterViewInit} from '@angular/core';
import {Router} from '@angular/router';
import {Location} from '@angular/common';

// nativescript
import {ModalDialogService, ModalDialogHost, ModalDialogOptions} from "nativescript-angular/directives/dialogs";
import * as app from 'application';
import * as dialogs from 'ui/dialogs';
import * as fs from 'file-system';
import {isIOS} from 'platform';
import {Color} from 'color';
import {screen} from 'platform';
import {Animation} from 'ui/animation';
import {topmost} from 'ui/frame';
import {AnimationCurve} from 'ui/enums';
declare var TNSEZRecorder, TNSEZAudioPlayer, AudioPlot;
if (isIOS) {
  var ezAudio = require('nativescript-ezaudio');
  TNSEZRecorder = ezAudio.TNSEZRecorder;
  TNSEZAudioPlayer = ezAudio.TNSEZAudioPlayer;
  AudioPlot = ezAudio.AudioPlot;
}

// libs
import {Store} from '@ngrx/store';
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {Subscription} from "rxjs/Subscription";
import * as _ from 'lodash';

// app
import {BaseComponent, LogService, ProgressService, FancyAlertService, Utils, Config, ColorService} from '../../shared/core/index';
import {IShoutoutState, SHOUTOUT_ACTIONS, ShoutoutService, TrackModel, ShoutoutModel, PLAYER_ACTIONS, PlaylistModel, FIREBASE_ACTIONS, SearchService} from '../../shared/shoutoutplay/index';
import {TrackChooserComponent} from './track-chooser.component';

declare var interop: any, zonedCallback: Function, kCGBlendModeSourceAtop: any, HUGE_VAL: any, kCAFillModeForwards: any, kCAMediaTimingFunctionEaseInEaseOut: any;

@BaseComponent({
  // moduleId: module.id,
  selector: 'record',
  templateUrl: './components/record/record.component.html',
  // styleUrls: ['./components/record/record.component.css'],
  directives: [ModalDialogHost],
  providers: [ModalDialogService]
})
export class RecordComponent implements AfterViewInit, OnDestroy {
  @ViewChild('audioplot') audioplotEl: ElementRef;
  @ViewChild('bigRecordBtn') bigRecordBtn: ElementRef;
  @ViewChild('readyRecordLabel') readyRecordLabel: ElementRef;
  @ViewChild('playbackArea') playbackArea: ElementRef;
  @ViewChild('addToTrackArea') addToTrackArea: ElementRef;
  @ViewChild('bigSaveBg') bigSaveBg: ElementRef;
  
  public audioPlotColor: string;
  public recordTime: string;
  public showPlayBtn: boolean = false;
  public showSaveArea: boolean = false;
  public isRecording: boolean = false;
  public isPlaying: boolean = false;
  public recordBtn$: BehaviorSubject<string> = new BehaviorSubject('fa-circle');
  public playBtn$: BehaviorSubject<string> = new BehaviorSubject('fa-play-circle-o');
  public playBtnTxt: string = `Play`;
  public saveTxt: string;
  public saveBtnWidth: string;
  public saveBtnTxtWidth: string;
  public isSmallerScreen: boolean = false;

  private _recorder: any;
  private _player: any;
  private _audioplot: any;
  private _bigRecordBtn: any;
  private _readyRecordLabel: any;
  private _playbackArea: any;
  private _addToTrackArea: any;
  private _bigSaveBg: any;
  private _recordingPath: string;
  private _reloadPlayer: boolean = false;
  private _sessionRecordings: Array<any> = [];
  private _chosenTrack: TrackModel;
  private _showingGiantRecordUI: boolean = true;
  private _firstPlayShow: boolean = false; 
  private _glowiOSView;  
  private _sub: Subscription;

  constructor(private logger: LogService, private modal: ModalDialogService, private store: Store<any>, private progress: ProgressService, private shoutoutService: ShoutoutService, private searchService: SearchService, private location: Location, private fancyalert: FancyAlertService) {

    // set audio plot color based on active theme
    this.audioPlotColor = ColorService.Active.BRIGHT;

    // always stop all tracks playing from search results
    searchService.stopAll();
    // always reset player to clear internal state (like shoutouts in queue, etc.)
    store.dispatch({ type: PLAYER_ACTIONS.STOP, payload: { reset: true } });
    logger.debug(`RecordComponent constructor()`);
    this.isSmallerScreen = screen.mainScreen.heightDIPs <= 568;

    if (this.shoutoutService.quickRecordTrack) {
      this.saveTxt = 'Save';
      this.saveBtnWidth = '70%';
      this.saveBtnTxtWidth = '30%';
    } else {
      this.saveTxt = 'Add to Track';
      this.saveBtnWidth = '55%';
      this.saveBtnTxtWidth = '45%';
    }

    this._recorder = new TNSEZRecorder();
    this._recorder.delegate().audioEvents.on('audioBuffer', (eventData) => {
      this._audioplot.bufferData = {
        buffer: eventData.data.buffer,
        bufferSize: eventData.data.bufferSize
      };
    });
    this._recorder.delegate().audioEvents.on('recordTime', (eventData) => {
      this.recordTime = eventData.data.time;
    });

    // player
    this._player = new TNSEZAudioPlayer(true);
    this._player.delegate().audioEvents.on('audioBuffer', (eventData) => {
      this._audioplot.bufferData = {
        buffer: eventData.data.buffer,
        bufferSize: eventData.data.bufferSize
      };
    });
    this._player.delegate().audioEvents.on('reachedEnd', zonedCallback((eventData) => {
      this.logger.debug(`RecordComponent: audioEvents.on('reachedEnd'), calling this.togglePlay()`);
      this.togglePlay();
    }));

    this._sub = store.select('shoutout').subscribe((state: IShoutoutState) => {
      if (state.showTrackPicker) {
        let options: ModalDialogOptions = {
          fullscreen: false
        };
        this.modal.showModal(TrackChooserComponent, options).then(zonedCallback((track?: TrackModel) => {
          this.store.dispatch({ type: SHOUTOUT_ACTIONS.CLOSE_PICKER });
          if (track) {
            this.addToTrack(track);
          }
        }));
      }
    });
  }

  public toggleRecord() {
    if (this._recorder.isRecording()) {
      this._recorder.stop();
      this.toggleRecordState(false);
      this._reloadPlayer = true;
    } else {
      this._recordingPath = Utils.documentsPath(`recording-${Date.now()}.m4a`);
      this.logger.debug(this._recordingPath);
      this._sessionRecordings.push({ path: this._recordingPath, saved: false });
      this._recorder.record(this._recordingPath);
      this.toggleRecordState(true);
    }
  }

  public togglePlay() {
    this._player.togglePlay(this._recordingPath, this._reloadPlayer);  
    this.togglePlayState(!this.isPlaying);
  }

  public toggleRecordState(state: boolean) {
    this.isRecording = state;
    this.showPlayBtn = !state;
    if (this.isRecording) {
      this.recordBtn$.next('fa-stop');
      if (this._showingGiantRecordUI) {
        this.hideGiantRecordUI();
      } else {
        this.showPlayControls(false);
      }
    } else {
      this.recordBtn$.next('fa-circle');
      this.showPlayControls(true);
    }
  }

  public rewind() {
    this._player.seekToFrame(0);
  }

  public saveToTrack() {
    if (this.shoutoutService.quickRecordTrack) {
      this.addToTrack(this.shoutoutService.quickRecordTrack);
    } else {
      this.store.dispatch({ type: SHOUTOUT_ACTIONS.SHOW_PICKER });
    }
  }

  private addToTrack(track?: TrackModel) {
    if (track) {
      this.logger.debug(`Chose Track!`);
      this._chosenTrack = track;
    }
    this.progress.show();
    setTimeout(() => {
      this.progress.hide();
      // prompt user for their name
      this.fancyalert.prompt('Name', '', 'Add your name...', 'edit', (value: any) => {
        this.saveShoutout(value);
      });
    }, 1200);
  }

  private setSavedSession() {
    for (let r of this._sessionRecordings) {
      if (r.path === this._recordingPath) {
        r.saved = true;
        break;
      }
    }
  }

  private saveShoutout(author: string) {
    this.setSavedSession();

    let newShoutout = new ShoutoutModel({
      author: author,
      trackId: this._chosenTrack.id,
      playlistId: this._chosenTrack.playlistId,
      filename: Utils.getFilename(this._recordingPath)
    });
    this.store.dispatch({ type: FIREBASE_ACTIONS.CREATE_SHOUTOUT, payload: newShoutout });
    setTimeout(() => {
      this.location.back();
    }, 1000);
  }

  private togglePlayState(force?: boolean) {
    this.isPlaying = typeof force !== 'undefined' ? force : !this.isPlaying;
    this._reloadPlayer = false;
    if (this.isPlaying) {
      this.playBtnTxt = 'Pause';
      this.playBtn$.next('fa-pause-circle-o');
    } else {
      this.playBtnTxt = 'Play';
      this.playBtn$.next('fa-play-circle-o');
    }
  }

  private showPlayControls(enable: boolean) {
    this.logger.debug(`showPlayControls: ${enable}`);
    
    let fullHeight = screen.mainScreen.heightDIPs;
    let playY = 320;
    let backX = 70;
    let addY = screen.mainScreen.heightDIPs - 140;
    let backY = screen.mainScreen.heightDIPs - 250;

    if (fullHeight <= 568) {
      this.isSmallerScreen = true;
      // iphone 5
      playY = playY - 100;
      backX = backX - 50;
    }
    
    let opacity = 1;
    if (!enable) {
      playY = fullHeight;
      addY = fullHeight;
      backY = fullHeight;
      opacity = 0;
    }
    let animateDefs = [];
    let animateSet;

    if (!this._firstPlayShow) {
      this._firstPlayShow = true;
      animateDefs.push({
        target: this._playbackArea,
        translate: { x: 0, y: fullHeight },
        opacity: 0,
        duration: 1
      });
      animateDefs.push({
        target: this._addToTrackArea,
        translate: { x: 0, y: fullHeight },
        opacity: 0,
        duration: 1
      });
      animateDefs.push({
        target: this._bigSaveBg,
        translate: { x: 70, y: fullHeight },
        opacity: 0,
        duration: 1
      });
      animateSet = new Animation(animateDefs);
      animateSet.play();
    }

    setTimeout(() => {
      animateDefs = [];
      animateDefs.push({
        target: this._playbackArea,
        translate: { x: 0, y: playY },
        opacity: opacity,
        duration: 1000,
        curve: AnimationCurve.spring
      });
      animateDefs.push({
        target: this._addToTrackArea,
        translate: { x: 0, y: addY },
        opacity: opacity,
        duration: 1000,
        delay: 200,
        curve: AnimationCurve.spring
      });
      animateDefs.push({
        target: this._bigSaveBg,
        translate: { x: backX, y: backY },
        opacity: opacity,
        duration: 1000,
        delay: 400,
        curve: AnimationCurve.spring
      });
      animateSet = new Animation(animateDefs);
      animateSet.play();
    }, 100);    
  }

  private hideGiantRecordUI() {
    this._showingGiantRecordUI = false;
    let animateDefs = [];
    animateDefs.push({
      target: this._bigRecordBtn,
      translate: { x: screen.mainScreen.widthDIPs-140, y: -120 },
      scale: { x: .5, y: .5 },
      opacity: 0,
      duration: 600,
      curve: AnimationCurve.easeInOut
    });
    animateDefs.push({
      target: this._readyRecordLabel,
      opacity: 0,
      duration: 600
    });
    let animateSet = new Animation(animateDefs);
    animateSet.play();

    if (isIOS) {
      this.hideGiantRecordBtniOS();
    } else {
      this.hideGiantRecordBtnAndroid();
    } 
    
    setTimeout(() => {
      if (isIOS) {
        this._glowiOSView.removeFromSuperview();
        this._glowiOSView = undefined;
      }
      this._startAnimateSet.cancel();
    }, 1000);
  }

  private hideGiantRecordBtnAndroid() {
    this.logger.debug('TO DO animate record on android');
  }

  private hideGiantRecordBtniOS() {
    let animation = CABasicAnimation.animationWithKeyPath("opacity");
    // animation.fromValue = 1;
    animation.toValue = 0;
    animation.duration = 0.6;
    animation.fillMode = kCAFillModeForwards;
    animation.removedOnCompletion = false;
    this._glowiOSView.layer.addAnimationForKey(animation, "out");
    animation = CABasicAnimation.animationWithKeyPath("position.x");
    // animation.fromValue = ((screen.mainScreen.widthDIPs / 2) - 84);
    animation.toValue = screen.mainScreen.widthDIPs-140;
    animation.duration = 0.6;
    animation.timingFunction = CAMediaTimingFunction.functionWithName(kCAMediaTimingFunctionEaseInEaseOut);
    animation.fillMode = kCAFillModeForwards;
    animation.removedOnCompletion = false;
    this._glowiOSView.layer.addAnimationForKey(animation, "xOut");
    animation = CABasicAnimation.animationWithKeyPath("position.y");
    // animation.fromValue = ((screen.mainScreen.heightDIPs / 2) - 150);
    animation.toValue = -120;
    animation.duration = 0.6;
    animation.timingFunction = CAMediaTimingFunction.functionWithName(kCAMediaTimingFunctionEaseInEaseOut);
    animation.fillMode = kCAFillModeForwards;
    animation.removedOnCompletion = false;
    this._glowiOSView.layer.addAnimationForKey(animation, "yOut");
  }

  private nativeiOSGlow() {
    let uiButton = this._bigRecordBtn.ios;

    if (uiButton) {
      let image;
      let color = new Color('#E42338').ios; //UIColor.colorWithRedGreenBlueAlpha(0.89, 0.14, 0.22, 1);
      UIGraphicsBeginImageContextWithOptions(uiButton.bounds.size, false, UIScreen.mainScreen().scale);
      uiButton.layer.renderInContext(UIGraphicsGetCurrentContext());
      
      let path = UIBezierPath.bezierPathWithRect(CGRectMake(0, 0, uiButton.bounds.size.width, uiButton.bounds.size.height));
      color.setFill();
      path.fillWithBlendModeAlpha(kCGBlendModeSourceAtop, 1);
      image = UIGraphicsGetImageFromCurrentImageContext();
      UIGraphicsEndImageContext();

      this._glowiOSView = UIImageView.alloc().initWithImage(image);
      this._glowiOSView.center = uiButton.center;
      uiButton.superview.insertSubviewAboveSubview(this._glowiOSView, uiButton);
      
      // let absolutePosition: CGRect = uiButton.convertRectToView(uiButton.bounds, null);
      // this.logger.debug(`uiButton absolutePosition...`);
      // this.logger.debug(absolutePosition.origin.x);
      // this.logger.debug(absolutePosition.origin.y);

      // We don't want to show the image, but rather a shadow created by
      // Core Animation. By setting the shadow to white and the shadow radius to 
      // something large, we get a pleasing glow.
      this._glowiOSView.alpha = 0;
      this._glowiOSView.frame = CGRectMake(((screen.mainScreen.widthDIPs / 2) - 84), ((screen.mainScreen.heightDIPs / 2) - 150), uiButton.bounds.size.width, uiButton.bounds.size.height);
      this._glowiOSView.layer.transform = CATransform3DMakeScale(1.2, 1.2, 1);
      this._glowiOSView.layer.shadowColor = color.CGColor;
      this._glowiOSView.layer.shadowOffset = CGSizeZero;
      this._glowiOSView.layer.shadowRadius = 30;
      this._glowiOSView.layer.shadowOpacity = 1.0;
      
      // Create an animation that slowly fades the glow view in and out forever.
      let animation = CABasicAnimation.animationWithKeyPath("opacity");
      animation.fromValue = .1;
      animation.toValue = 1;
      animation.repeatCount = 10000000;
      animation.duration = 1.0;
      animation.autoreverses = true;
      animation.timingFunction = CAMediaTimingFunction.functionWithName(kCAMediaTimingFunctionEaseInEaseOut);
      
      this._glowiOSView.layer.addAnimationForKey(animation, "pulse");

    }
  }

  private nativeAndroidGlow() {
    this.logger.debug('TO DO!!');
  }

  private _startAnimateSet: Animation;  
  ngAfterViewInit() {
    this._audioplot = this.audioplotEl.nativeElement;
    this._bigRecordBtn = this.bigRecordBtn.nativeElement;
    this._readyRecordLabel = this.readyRecordLabel.nativeElement;
    this._playbackArea = this.playbackArea.nativeElement;
    this._addToTrackArea = this.addToTrackArea.nativeElement;
    this._bigSaveBg = this.bigSaveBg.nativeElement;
    // animate start
    // this.logger.debug(screen.mainScreen.widthDIPs + 'x' + screen.mainScreen.heightDIPs);
    // this.logger.debug(((screen.mainScreen.widthDIPs/2)-100) + 'x' + ((screen.mainScreen.heightDIPs/2)-100));
    // this.logger.debug('btn size:');
    // this.logger.debug(this._bigRecordBtn.width + 'x' + this._bigRecordBtn.height);

    this.setupRecordAnimation();
  }

  private setupRecordAnimation() {
    // trying to set initial position = this did not work - don't know why
    // this._bigRecordBtn.ios.frame = CGRectMake(((screen.mainScreen.widthDIPs / 2) - 120), ((screen.mainScreen.heightDIPs / 2) - 170), this._bigRecordBtn.ios.bounds.size.width, this._bigRecordBtn.ios.bounds.size.height);
    // this._readyRecordLabel.ios.frame = CGRectMake(screen.mainScreen.widthDIPs, ((screen.mainScreen.heightDIPs/2)-170), this._readyRecordLabel.ios.bounds.size.width, this._readyRecordLabel.ios.bounds.size.height);

    // set initial position, using animation which works
    let animateDefs = [];
    animateDefs.push({
      target: this._bigRecordBtn,
      translate: { x: ((screen.mainScreen.widthDIPs/2)-120), y: ((screen.mainScreen.heightDIPs/2)-170) },
      opacity: 0,
      duration: 1
    });
    animateDefs.push({
      target: this._readyRecordLabel,
      translate: { x: screen.mainScreen.widthDIPs, y: screen.mainScreen.heightDIPs - 200 },
      opacity: 0,
      duration: 1
    });
    let animateSet = new Animation(animateDefs);
    animateSet.play();
    setTimeout(() => {
      animateDefs = [];
      animateDefs.push({
        target: this._bigRecordBtn,
        translate: { x: ((screen.mainScreen.widthDIPs/2)-84), y: ((screen.mainScreen.heightDIPs/2)-150) },
        scale: { x: 1.2, y: 1.2 },
        opacity: 1,
        duration: 1000,
        curve: AnimationCurve.spring
      });
      animateDefs.push({
        target: this._readyRecordLabel,
        translate: { x: (-screen.mainScreen.widthDIPs - 220), y: screen.mainScreen.heightDIPs - 200 },
        opacity: 1,
        duration: 3000,
        iterations: Number.POSITIVE_INFINITY
      });
      this._startAnimateSet = new Animation(animateDefs);
      this._startAnimateSet.play().then(() => {
        // nothing
      }, () => {
        // stopped
      }).catch((e) => {
        this.logger.debug(`_startAnimateSet error: ${e.message}`);
      });
      setTimeout(() => {
        if (isIOS) {
          this.nativeiOSGlow();
        } else {
          // TODO
          this.nativeAndroidGlow();
        }
      }, 1000);
    }, 600);
  }

  ngOnDestroy() {
    this.logger.debug(`RecordComponent ngOnDestroy`);
    this.shoutoutService.removeRecordings(this._sessionRecordings.filter(r => !r.saved).map(r => r.path));
    // remove events and free up resources
    this._recorder.delegate().audioEvents.off('audioBuffer');
    this._recorder.delegate().audioEvents.off('recordTime');
    this._player.delegate().audioEvents.off('audioBuffer');
    this._player.delegate().audioEvents.off('reachedEnd');
    this._recorder = undefined;
    this._player = undefined;
    // set av category session back to playback
    
    // reset fallback (issue stems from spotify playlist bulk creation - when tracks have no playlistId)
    Config.SELECTED_PLAYLIST_ID = undefined;

    if (this._sub) {
      this._sub.unsubscribe();
    }
  }
}