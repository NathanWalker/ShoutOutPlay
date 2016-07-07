// angular
import {Injectable} from '@angular/core';

// libs
import {ProgressService} from './progress.service';

declare var MBProgressHUDModeCustomView: any;

@Injectable()
export class DialogsService {

  constructor(private loader: ProgressService) {

  }

  public success(msg?: string) {
    this.loader.show({ message: msg, ios: { mode: MBProgressHUDModeCustomView, customView: 'Checkmark.png' } });
    setTimeout(() => {
      this.loader.hide();
    }, 1000);
  } 
}