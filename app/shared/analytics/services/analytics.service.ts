// angular
import {Injectable, Inject} from '@angular/core';

// libs
import * as _ from 'lodash';

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
  private _firebase: any;
  private _devMode: boolean = false;

  constructor() {
    // this.devMode(true);
  }

  /**
   * Track actions, events, etc.
   **/
  public track(action: string, properties: IAnalyticsProperties): void {
    if (!this.devMode() && this._firebase && this._firebase.analytics) {
      let props = [];
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
      this._firebase.analytics.logEvent({
        key: action,
        properties: props
      }).then(() => {
        // ignore
      });
    } 
  }

  /**
   * Identify authenticated users
   **/
  public identify(properties: any) {
    if (!this.devMode() && this._firebase && this._firebase.analytics) {
      this._firebase.analytics.setUserProperty(properties);
    }
  }

  public setFirebase(fb: any) {
    this._firebase = fb;
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

  constructor( @Inject(AnalyticsService) public analytics: AnalyticsService, public firebase?: any) {
    if (firebase) {
      analytics.setFirebase(firebase);
    }
  }

  /**
   * Track actions, events, etc.
   **/
  track(action: string, properties: IAnalyticsProperties): void {
    this.analytics.track(action, _.extend(properties, { category: this.category }));
  }     
}
