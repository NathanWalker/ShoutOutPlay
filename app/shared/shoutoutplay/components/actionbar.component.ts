import { Component } from '@angular/core';

import { DrawerService } from '../../core/index';
import { AuthService } from '../services/auth.service';

@Component({
  // moduleId: module.id,
  selector: 'MainActionBar',
  templateUrl: './shared/shoutoutplay/components/actionbar.component.html'
})
export class MainActionBarComponent {

  constructor(public drawerService: DrawerService, public authService: AuthService) {

  }
}