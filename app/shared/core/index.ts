// angular
import {NS_HTTP_PROVIDERS} from 'nativescript-angular/http';

// app
import {LogService} from './services/log.service';
import {DrawerService} from './services/drawer.service';
import {ProgressService} from './services/progress.service';
import {DialogsService} from './services/dialogs.service';
import {FancyAlertService} from './services/fancyalert.service';

export const CORE_PROVIDERS: any[] = [
  NS_HTTP_PROVIDERS,
  DrawerService,
  ProgressService,
  DialogsService,
  LogService,
  FancyAlertService
];

// decorators
export * from './decorators/base.component';
export * from './decorators/reuse.component';

// interfaces
export * from './interfaces/iconsole';

// services
export * from './delegates/app.delegate';
export * from './services/animate.service';
export * from './services/actionbar.util';
export * from './services/color.service';
export * from './services/config.service';
export * from './services/console.service';
export * from './services/drawer.service';
export * from './services/log.service';
export * from './services/progress.service';
export * from './services/dialogs.service';
export * from './services/fancyalert.service';
export * from './services/text.service';
