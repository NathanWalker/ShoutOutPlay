import {ElementRef, OnInit, ViewChild, AfterViewInit} from '@angular/core';
import {Router} from '@angular/router';
import {Location} from '@angular/common';

import {device, screen} from 'platform';

import {BaseComponent, CoreConfigService, LogService} from '../../shared/core/index';

@BaseComponent({
    moduleId: module.id,
    selector: 'welcome',
    templateUrl: `welcome.component.html`
})
export class WelcomeComponent implements OnInit, AfterViewInit {

    constructor(private logger: LogService, private location: Location, private _router: Router) {
      setTimeout(() => {
        this.location.back();
      }, 2000);
    }

    ngOnInit() {

    }

    ngAfterViewInit() {   
        
    }
}