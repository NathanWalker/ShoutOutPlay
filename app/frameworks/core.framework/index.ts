// angular
import {HTTP_PROVIDERS} from 'angular2/http';

// app
import {LogService} from './services/log.service';
import {ProgressService} from './services/progress.service';

export const CORE_PROVIDERS: any[] = [
  HTTP_PROVIDERS,
  ProgressService,
  LogService
];

// decorators
export * from './decorators/base.component';

// interfaces
export * from './interfaces/iconsole';

// services
export * from './delegates/app.delegate';
export * from './services/actionbar.util';
export * from './services/core-config.service';
export * from './services/console.service';
export * from './services/log.service';
export * from './services/progress.service';
