// angular
import { NgModule } from '@angular/core';

// nativescript
import { NS_HTTP_PROVIDERS } from 'nativescript-angular/http';
import { NativeScriptRouterModule } from 'nativescript-angular/router';

// app
import { SHOUTOUTPLAY_PROVIDERS } from './index';

/**
 * Do not specify providers for modules that might be imported by a lazy loaded module.
 */

@NgModule({
  imports: [
    NativeScriptRouterModule
  ],
  exports: [
    NativeScriptRouterModule
  ],
  providers: [
    NS_HTTP_PROVIDERS,
    SHOUTOUTPLAY_PROVIDERS
  ]
})
export class ShoutOutPlayModule {

}
