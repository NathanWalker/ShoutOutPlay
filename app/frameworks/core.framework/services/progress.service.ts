// angular
import {Injectable} from 'angular2/core';

// libs
import {LoadingIndicator} from 'nativescript-loading-indicator';

@Injectable()
export class ProgressService {
  private loader: LoadingIndicator;

  constructor() {
    this.loader = new LoadingIndicator();
  }

  public show() {
    this.loader.show();
  }

  public hide() {
    this.loader.hide();
  }  
}