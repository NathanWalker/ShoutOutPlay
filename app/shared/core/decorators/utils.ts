// angular
import {Component, ChangeDetectionStrategy} from '@angular/core';

// libs
// import {TNSFontIconPipe, TNSFontIconPurePipe} from 'nativescript-ng2-fonticon/nativescript-ng2-fonticon';

declare var Reflect: any;
const _reflect: any = Reflect;

export class DecoratorUtils {
  public static getMetadata(metadata: any = {}, customDecoratorMetadata?: any) {
    
    if (metadata.changeDetection) {
      metadata.changeDetection = metadata.changeDetection;
    } else {
      // default OnPush
      metadata.changeDetection = ChangeDetectionStrategy.OnPush;
    }
    
    if (metadata.encapsulation) {
      metadata.encapsulation = metadata.encapsulation;
    }
    
    // initialize anything 
    if (metadata.init) {
      metadata.init();
    }   

    return metadata;
  }
  
  public static annotateComponent(cls: any, metadata: any = {}, customDecoratorMetadata?: any) {
    let annotations = _reflect.getMetadata('annotations', cls) || [];
    annotations.push(new Component(DecoratorUtils.getMetadata(metadata, customDecoratorMetadata)));
    _reflect.defineMetadata('annotations', annotations, cls);
    return cls;
  }
}
