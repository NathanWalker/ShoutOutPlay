// angular
import {Component} from 'angular2/core';

// libs
import {TNSFontIconPipe} from 'nativescript-ng2-fonticon/nativescript-ng2-fonticon';

// app
import {BaseComponent, LogService} from '../../frameworks/core.framework/index';

@BaseComponent({
  selector: 'record',
  templateUrl: `./components/record/record.component.html`
})
export class RecordComponent {

  constructor(private logger: LogService) {
    
  }
  
  public record() {
    console.log('record');
  }  
}