// angular
import {Component, OnDestroy, NgZone, ViewChild} from '@angular/core';
import {Router} from '@angular/router-deprecated';

// nativescript
import {ModalDialogService, ModalDialogHost, ModalDialogOptions} from "nativescript-angular/directives/dialogs";
import {topmost} from 'ui/frame';

// libs
import {Store} from '@ngrx/store';
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {TNSEZRecorder, TNSEZAudioPlayer} from 'nativescript-ezaudio';
import * as fs from 'file-system';
import * as _ from 'lodash';

// app
import {BaseComponent, LogService} from '../../frameworks/core.framework/index';
import {ShoutoutStateI, SHOUTOUT_ACTIONS, TrackModel} from '../../frameworks/shoutoutplay.framework/index';
import {TrackChooserComponent} from './track-chooser.component';

@BaseComponent({
  selector: 'record',
  templateUrl: `./components/record/record.component.html`,
  styleUrls: [`./components/record/record.component.css`],
  directives: [ModalDialogHost]
})
export class RecordComponent implements OnDestroy {
  @ViewChild('audioplot') audioplot: any;
  public audioPlotColor: string = '#FFF803';
  public audioPlotBufferData$: BehaviorSubject<any> = new BehaviorSubject({
    buffer: new interop.Reference(),
    bufferSize: 0
  });
  public recordTime: string;
  public showPlayBtn: boolean = false;
  public showSaveArea: boolean = false;
  public isRecording: boolean = false;
  public isPlaying: boolean = false;
  public recordBtn$: BehaviorSubject<string> = new BehaviorSubject('fa-circle');
  public playBtn$: BehaviorSubject<string> = new BehaviorSubject('fa-play');
  public playBtnTxt: string = `Play`;

  private _recorder: any;
  private _player: any;
  private _recordingPath: string;
  private _reloadPlayer: boolean = false;
  private _sessionRecordings: Array<any>;
  
  constructor(private logger: LogService, private _ngZone: NgZone, private modal: ModalDialogService, private store: Store<any>, private router: Router) {
    this._sessionRecordings = [];
    
    this._recorder = new TNSEZRecorder();
    this._recorder.delegate().audioEvents.on('audioBuffer', (eventData) => {
      this._ngZone.run(() => {
        // this.audioplot.bufferData = {
        //   buffer: eventData.data.buffer,
        //   bufferSize: eventData.data.bufferSize
        // };
        this.audioPlotBufferData$.next({
          buffer: eventData.data.buffer,
          bufferSize: eventData.data.bufferSize
        });
      });
      
    });
    this._recorder.delegate().audioEvents.on('recordTime', (eventData) => {
      this.recordTime = eventData.data.time;
    });

    // player
    this._player = new TNSEZAudioPlayer(true);
    this._player.delegate().audioEvents.on('audioBuffer', (eventData) => {
      this._ngZone.run(() => {
        this.audioPlotBufferData$.next({
          buffer: eventData.data.buffer,
          bufferSize: eventData.data.bufferSize
        });
      });
    });

    store.select('shoutout').subscribe((state: ShoutoutStateI) => {
      if (state.showTrackPicker) {
        let options: ModalDialogOptions = {
            context: { promptMsg: "This is the prompt message!" },
            fullscreen: false
        };
        this.modal.showModal(TrackChooserComponent, options).then((track?: TrackModel) => {
          this.store.dispatch({ type: SHOUTOUT_ACTIONS.CLOSE_PICKER });
          this.addToTrack(track);
        });
      }
    });
  }
  
  public toggleRecord() {
    if (this._recorder.isRecording()) {
      this._recorder.stop();
      this.toggleRecordState(false);
      this._reloadPlayer = true;
    } else {
      let audioFolder = fs.knownFolders.currentApp().getFolder("audio");
      console.log(JSON.stringify(audioFolder));  
      this._recordingPath = `${audioFolder.path}/recording-${Date.now()}.m4a`;
      this._sessionRecordings.push({ path: this._recordingPath, saved: false });
      this._recorder.record(this._recordingPath);  
      this.toggleRecordState(true);
    }
  } 

  public togglePlay() {
    this._player.togglePlay(this._recordingPath, this._reloadPlayer);
    this.isPlaying = !this.isPlaying;
    this._reloadPlayer = false;
    if (this.isPlaying) {
      this.playBtnTxt = 'Pause';
      this.playBtn$.next('fa-pause');
    } else {
      this.playBtnTxt = 'Play';
      this.playBtn$.next('fa-play');
    }
  }

  public toggleRecordState(state: boolean) {
    this.isRecording = state;
    this.showPlayBtn = !state;
    if (this.isRecording) {
      this.recordBtn$.next('fa-stop');
    } else {
      this.recordBtn$.next('fa-circle');
    }
  }

  public saveToTrack() {
    this.setSavedSession();
    this.store.dispatch({ type: SHOUTOUT_ACTIONS.SHOW_PICKER });
  }

  private addToTrack(track?: TrackModel) {
    // TODO: add shoutout to track then navigate back 
    if (track) {
      this.logger.debug(`Chose Track!`);
      this.logger.debug(track);
    }
    this.router.navigate(['/']);
  }

  private setSavedSession() {
    for (let r of this._sessionRecordings) {
      if (r.path === this._recordingPath) {
        r.saved = true;
        break;
      }
    }
  }

  ngOnDestroy() {
    let cnt = 0;
    let advance = () => {
      cnt++;
      if (cnt < this._sessionRecordings.length) {
        deleteFile();
      }
    };
    let deleteFile = () => {
      let file = this._sessionRecordings[cnt];
      if (file.saved) {
        advance();
      } else {        
        let nsFile = fs.File.fromPath(file.path);
        nsFile.remove().then(() => {
          advance();
        }, () => {
          advance();
        });
      } 
    };
    deleteFile();
  }
}