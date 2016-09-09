// angular
import {Injectable, Inject} from '@angular/core';

// nativescript
import * as app from 'application';
import {isIOS} from 'platform';

declare var com;

// libs
import * as _ from 'lodash';
import firebase = require("nativescript-plugin-firebase");

export interface IAnalyticsProperties {
  category?: string;
  label?: string;
  value?: number;
}

export interface IAnalytics {
  track(action: string, properties: IAnalyticsProperties): void;
}

@Injectable()
export class AnalyticsService implements IAnalytics {
  private _devMode: boolean = false;

  constructor() {
    // this.devMode(true);
  }

  /**
   * Track actions, events, etc.
   **/
  public track(action: string, properties: IAnalyticsProperties): void {
    if (isIOS && !this.devMode() && firebase && firebase.analytics) {
      let props:any[] = [];
      if (properties) {
        if (properties.category) {
          props.push({
            key: 'category',
            value: properties.category
          });
        }
        if (properties.label) {
          props.push({
            key: 'label',
            value: properties.label
          });
        }
        if (properties.value) {
          props.push({
            key: 'value',
            value: properties.value
          });
        }
      }
      // console.log(`---------- logEvent key: ${action}`);
      // for (let p of props) {
      //   console.log(`key: ${p.key}, value: ${p.value}`);
      // }
      firebase.analytics.logEvent({
        key: action,
        parameters: props
      }).then(() => {
        // ignore
      });
    } 
  }

  /**
   * Identify authenticated users
   **/
  public identify(properties: any) {
    if (!this.devMode() && firebase && firebase.analytics) {
      firebase.analytics.setUserProperty(properties);
    }
  }

  /**
   * Control whether analytics are tracked
   * true: dev mode on, therefore do not track anything
   * false: dev mode off, track everything
   **/
  public devMode(enable?: boolean): boolean {
    if (typeof enable !== 'undefined') {
      this._devMode = enable;
    } 
    return this._devMode;
  }   
}

/**
 * Base class
 * Standardizes tracking actions and categorization
 */
export class Analytics implements IAnalytics {
  // sub-classes should define their category
  public category: string;

  constructor( @Inject(AnalyticsService) public analytics: AnalyticsService) {

  }

  /**
   * Track actions, events, etc.
   **/
  track(action: string, properties: IAnalyticsProperties): void {
    this.analytics.track(action, Object.assign({}, properties, { category: this.category }));
  }     
}
