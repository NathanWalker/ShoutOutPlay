import { Component } from '@angular/core';

import { Store } from '@ngrx/store';

import { DrawerService } from '../../core/index';

@Component({
  // moduleId: module.id,
  selector: 'SharedListActionBar',
  templateUrl: './shared/shoutoutplay/components/sharedlist-actionbar.component.html'
})
export class SharedlistActionBarComponent {

  constructor(public drawerService: DrawerService) {

  } 
}