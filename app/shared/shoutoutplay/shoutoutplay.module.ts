// angular
import { NgModule } from '@angular/core';

// nativescript
import { NativeScriptModule } from 'nativescript-angular/platform';
import { NativeScriptHttpModule } from 'nativescript-angular/http';
import { NativeScriptRouterModule } from 'nativescript-angular/router';

// app
import { SHOUTOUTPLAY_PROVIDERS } from './index';

/**
 * Do not specify providers for modules that might be imported by a lazy loaded module.
 */

@NgModule({
  imports: [
    NativeScriptModule,
    NativeScriptHttpModule,
    NativeScriptRouterModule
  ],
  exports: [
    NativeScriptModule,
    NativeScriptHttpModule,
    NativeScriptRouterModule
  ],
  providers: [
    SHOUTOUTPLAY_PROVIDERS
  ]
})
export class ShoutOutPlayModule {

}
