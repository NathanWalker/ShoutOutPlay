import {ViewEncapsulation} from '@angular/core';
import {DecoratorUtils} from './utils';

export function ReuseComponent(metadata: any={}) {
  return function(cls: any) {
    return DecoratorUtils.annotateComponent(cls, metadata, {
      encapsulation: ViewEncapsulation.None
    });
  };
}
