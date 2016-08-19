import {Injectable} from '@angular/core';
import {SideDrawerType} from 'nativescript-telerik-ui-pro/sidedrawer/angular';

@Injectable()
export class DrawerService {

  public drawer: SideDrawerType;

  public toggle(force?: boolean) {
    // console.log(`drawerservice toggle force:`);
    // console.log(force);
    if (this.drawer) {
      if (typeof force !== 'undefined') {
        if (force === false) {
          this.drawer.closeDrawer();
        } else {

        }
      } else {
        // console.log(`calling toggleDrawerState`);
        this.drawer.toggleDrawerState();
      }
    }
  }
}