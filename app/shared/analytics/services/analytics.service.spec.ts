
import {ReflectiveInjector} from '@angular/core';

import {t} from '../../test/index';
import {AnalyticsService, Analytics} from '../index';

export function main() {
  t.describe('analytics: AnalyticsService', () => {
    let analyticsService: AnalyticsService;

    t.be(() => {
      let injector = ReflectiveInjector.resolveAndCreate([
        AnalyticsService
      ]);
      analyticsService = injector.get(AnalyticsService);
      analyticsService.devMode(false);
    });

    t.describe('api works', () => {
      t.it('track', () => {   
        // t.spyOn(segment, 'eventTrack');
        analyticsService.track('click', { category: 'TEST', label: 'Testing' });
        // t.e(segment.eventTrack).toHaveBeenCalledWith('click', { category: 'TEST', label: 'Testing' });
      });
      t.it('track devMode: ON', () => {   
        // t.spyOn(segment, 'eventTrack');

        // dev mode: shouldn't track anything
        analyticsService.devMode(true);
        analyticsService.track('click', { category: 'TEST', label: 'Testing' });
        // t.e(segment.eventTrack).not.toHaveBeenCalled();
      });
      t.it('pageTrack', () => {
        // t.spyOn(segment, 'pageTrack');
        analyticsService.pageTrack('/testing', { });
        // t.e(segment.pageTrack).toHaveBeenCalledWith('/testing', {});       
      });
      t.it('pageTrack devMode: ON', () => {
        // t.spyOn(segment, 'pageTrack');

        // dev mode: shouldn't track anything
        analyticsService.devMode(true);
        analyticsService.pageTrack('/testing', { });
        // t.e(segment.pageTrack).not.toHaveBeenCalled();        
      });
      t.it('identify', () => {
        t.spyOn(segment, 'setUserProperties');
        analyticsService.identify({ userId: 1, name: 'Test', email: 'name@domain.com' });
        // t.e(segment.setUserProperties).toHaveBeenCalledWith({ userId: 1, name: 'Test', email: 'name@domain.com' });     
      });
      t.it('identify devMode: ON', () => {
        // t.spyOn(segment, 'setUserProperties');

        // dev mode: shouldn't track anything
        analyticsService.devMode(true);
        analyticsService.identify({ userId: 1, name: 'Test', email: 'name@domain.com' });
        // t.e(segment.setUserProperties).not.toHaveBeenCalled();         
      });
    });
  });

  t.describe('analytics: Analytics (Base Class)', () => {
    let analyticsService: AnalyticsService;
    let analytics: Analytics;

    t.be(() => {
      let injector = ReflectiveInjector.resolveAndCreate([
        AnalyticsService
      ]);
      analyticsService = injector.get(AnalyticsService);
      analytics = new TestAnalytics(analyticsService);
      analytics.category = 'TEST';
    });

    t.describe('should allow descendants to track actions', () => {
      t.it('track', () => {   
        t.spyOn(analyticsService, 'track');
        analytics.track('action', { category: analytics.category, label: 'Testing' });
        t.e(analyticsService.track).toHaveBeenCalledWith('action', { category: analytics.category, label: 'Testing' });
      });
    });
  });  
}

class TestAnalytics extends Analytics { }
