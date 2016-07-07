import {ElementRef, OnInit, ViewChild, AfterViewInit} from '@angular/core';
import {Location} from '@angular/common';

import {device, screen} from 'platform';

import {BaseComponent, CoreConfigService, LogService} from '../../frameworks/core.framework/index';

@BaseComponent({
    moduleId: module.id,
    selector: 'intro',
    templateUrl: `intro.component.html`,
    styleUrls: [`intro.component.css`]
})
export class IntroComponent implements OnInit, AfterViewInit {
    public gifs: Array<string> = [];
    public maskCover: string;
    public textTop: number = 400;
    public textSize: number = 30;
    public textPadding: number = 40;
    @ViewChild("slides") slides: ElementRef;
    @ViewChild("step1") step1: ElementRef;
    @ViewChild("step2") step2: ElementRef;
    @ViewChild("step3") step3: ElementRef;
    @ViewChild("step4") step4: ElementRef;
    private _step1: any;
    private _step2: any;
    private _step3: any;
    private _step4: any;
    private _deviceHeight: number;

    constructor(private logger: LogService, private location: Location) {
        logger.debug(`Device model: ${device.model}`);
        logger.debug(`Dimensions: ${screen.mainScreen.widthPixels}x${screen.mainScreen.heightPixels}`);
        // iphone 6 plus: Dimensions: 1242x2208

        this._deviceHeight = screen.mainScreen.heightPixels;
        let path = `~/components/intro/gifs/`;
        let gifSuffix = '.gif';
        // TODO: make diff sized masks for other devices
        let mask = '';
        if (this._deviceHeight > 2001) {
            mask = 'iphone6plus';
            gifSuffix = `-plus${gifSuffix}`;
        } else if (this._deviceHeight < 2001 && this._deviceHeight > 1136) {
            mask = 'iphone6';
        } else if (this._deviceHeight <= 1136) {
            this.textTop = 330;
            this.textSize = 26;
            this.textPadding = 32;
            mask = 'iphone5';
        }

        this.logger.debug(`setting mask: ${mask}`);
        this.maskCover = `~/components/intro/img/${mask}.png`;
        for (let i = 0; i < 4; i++) {
            this.gifs.push(`${path}${i+1}${gifSuffix}`);
        }
    }

    public slideChange(e: any) {
        this.logger.debug(`slide change`);
        this.logger.debug(e.eventData.newIndex);
        switch (e.eventData.newIndex) {
            case 0:
                setTimeout(() => {
                    this._step1.start();
                    this._step2.stop();
                    this._step3.stop();
                    this._step4.stop();
                }, 100);
                break;
            case 1:
                setTimeout(() => {
                    this._step1.stop();
                    this._step2.start();
                    this._step3.stop();
                    this._step4.stop();
                }, 100);
                break;
            case 2:
                setTimeout(() => {
                    this._step1.stop();
                    this._step2.stop();
                    this._step3.start();
                    this._step4.stop();
                }, 100);
                break;
            case 3:
                setTimeout(() => {
                    this._step1.stop();
                    this._step2.stop();
                    this._step3.stop();
                    this._step4.start();
                }, 100);
                break;
        }
    }

    public close() {
        // CoreConfigService.SET_SEEN_INTRO(true);
        this.location.back();
    }

    ngOnInit() {

    }

    ngAfterViewInit() {
        let introSlides = this.slides.nativeElement;
        introSlides.constructView();
        this._step1 = this.step1.nativeElement;
        this._step2 = this.step2.nativeElement;
        this._step3 = this.step3.nativeElement;
        this._step4 = this.step4.nativeElement;

        setTimeout(() => {
            this._step2.stop();
            this._step3.stop();
            this._step4.stop();
        }, 500);     
        
    }
}