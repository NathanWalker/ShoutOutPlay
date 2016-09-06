// angular
import {Injectable} from '@angular/core';

// nativescript
import {isIOS} from 'platform';

// libs
import {ProgressService} from './progress.service';

declare var MBProgressHUDModeCustomView: any;

@Injectable()
export class DialogsService {

  constructor(private loader: ProgressService) {

  }

  public success(msg?: string) {
    let autoHide = () => {
      setTimeout(() => {
        this.loader.hide();
      }, 1000);
    };
    if (isIOS) {
      this.loader.show({ message: msg, ios: { mode: MBProgressHUDModeCustomView, customView: 'Checkmark.png' } });
      autoHide();
    } else {
      this.loader.hide(); // ensure all progress dialogs are closed
      setTimeout(() => {
        this.loader.show({ message: msg });
        autoHide();
      }, 400);
    }
    
  } 
}