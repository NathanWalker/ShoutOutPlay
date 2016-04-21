// angular
import {Injectable} from 'angular2/core';

// libs
import {LoadingIndicator, OptionsCommon} from 'nativescript-loading-indicator';

@Injectable()
export class ProgressService {
  private loader: LoadingIndicator;

  constructor() {
    this.loader = new LoadingIndicator();
  }

  public show(options?: OptionsCommon) {
    this.loader.show(options);
  }

  public hide() {
    this.loader.hide();
  }  
}