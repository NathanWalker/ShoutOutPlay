// angular
import { NgModule, ModuleWithProviders } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { RouterModule } from '@angular/router';
// import { HttpModule } from '@angular/http';

// app
import { CORE_PROVIDERS } from './index';

interface ICoreModuleOptions {
  window?: any;
  console?: any;
}

/**
 * Do not specify providers for modules that might be imported by a lazy loaded module.
 */

@NgModule({
  providers: CORE_PROVIDERS
})
export class CoreModule {
  // configuredProviders: *required to configure WindowService and ConsoleService per platform
  static forRoot(configuredProviders: Array<any>): ModuleWithProviders {
    return {
      ngModule: CoreModule,
      providers: configuredProviders
    };
  }
}
