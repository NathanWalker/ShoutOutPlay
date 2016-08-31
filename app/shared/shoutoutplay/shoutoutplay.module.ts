// angular
import { NgModule } from '@angular/core';

// app
import { SHOUTOUTPLAY_PROVIDERS } from './index';

/**
 * Do not specify providers for modules that might be imported by a lazy loaded module.
 */

@NgModule({
  providers: SHOUTOUTPLAY_PROVIDERS
})
export class ShoutOutPlayModule {

}
