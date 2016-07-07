// convenient shorthand 
import {Ng2Jasmine, TestApi} from './shorthand/ng2-jasmine';
export const t: TestApi = Ng2Jasmine;

// mocks
export * from './mocks/component.mock';
export * from './mocks/window.mock';
export * from './mocks/@ngrx/store.mock';

// providers
export * from './providers/common';

// shorthand
export * from './shorthand/ng2-jasmine';
