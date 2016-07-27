import {Injectable} from '@angular/core';
import {SideDrawerType} from 'nativescript-telerik-ui-pro/sidedrawer/angular';

import {LogService} from './log.service';

@Injectable()
export class DrawerService {

  public drawer: SideDrawerType;

  constructor(private logger: LogService) { }

  public toggle(force?: boolean) {
    this.logger.debug(`drawerservice toggle force:`);
    this.logger.debug(force);

    if (typeof force !== 'undefined') {
      if (force === false) {
        this.drawer.closeDrawer();
      } else {

      }
    } else {
      this.logger.debug(`calling toggleDrawerState`);
      this.drawer.toggleDrawerState();
    }
  }
}