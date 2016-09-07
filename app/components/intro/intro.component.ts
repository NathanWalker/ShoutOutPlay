import {ElementRef, OnInit, ViewChild, AfterViewInit} from '@angular/core';
import {Location} from '@angular/common';

import {device, screen, isIOS} from 'platform';

import {BaseComponent, Config, LogService} from '../../shared/core/index';
import {FirebaseService} from '../../shared/shoutoutplay/index';

@BaseComponent({
  // moduleId: module.id,
  selector: 'intro',
  templateUrl: './components/intro/intro.component.html'
  // styleUrls: ['./components/intro/intro.component.css']
})
export class IntroComponent implements OnInit, AfterViewInit {
  public gifs: Array<string> = [];
  public maskCover: string;
  public gif1Top: number = 120;
  public gif3Top: number = 110;
  public textTop: number = 400;
  public textSize: number = 30;
  public textPadding: number = 40;
  @ViewChild("swipelabel") swipelabel: ElementRef;
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

  constructor(private logger: LogService, private location: Location, public firebaseService: FirebaseService) {
    logger.debug(`Device model: ${device.model}`);
    logger.debug(`Dimensions: ${screen.mainScreen.widthPixels}x${screen.mainScreen.heightPixels}`);
    // iphone 6 plus: Dimensions: 1242x2208
    // Google Nexus 5 - 5.1.0 - API 22 - 1080x1920
    // Samsung Galaxy S6 - 6.0.0 - API 23 - 1440x2560

    this._deviceHeight = screen.mainScreen.heightPixels;
    
    let gifSuffix = '.gif';
    // TODO: make diff sized masks for other devices
    let mask = '';

    let adjustGifTop = () => {
      this.gif1Top = 90;
      this.gif3Top = -50;
    };

    if (this._deviceHeight > 2001) {
      mask = 'iphone6plus';
      gifSuffix = `-plus${gifSuffix}`;
      if (this._deviceHeight >= 2392 && !isIOS) {
        // large android
        this.gif1Top = 110;
        this.gif3Top = -60;
      }
    } else if ((this._deviceHeight < 2001 && this._deviceHeight > 1136) || (!isIOS && this._deviceHeight <= 1920)) {
      mask = 'iphone6';
      if (!isIOS) {
        adjustGifTop();
      }
    } else if (this._deviceHeight <= 1136) {
      adjustGifTop();
      this.textTop = 330;
      this.textSize = 26;
      this.textPadding = 32;
      mask = 'iphone5';
    }

    this.logger.debug(`setting mask: ${mask}`);
    // this.maskCover = `~/components/intro/img/${mask}.png`;
    this.setupGifs(mask, gifSuffix);
  }

  public slideChange(e: any) {
    this.logger.debug(`slide change`);
    this.logger.debug(e.eventData.newIndex);
    if (e.eventData.newIndex > 0) {
      this.gifControl(e.eventData.newIndex-1);
    }
  }

  public close() {
    if (isIOS) {
      this.swipelabel.nativeElement.ios
    }
    Config.SET_SEEN_INTRO(true);
    this.location.back();
  }

  private setupGifs(folderName: string, gifSuffix: string) {
    // let path = `~/components/intro/gifs/`;
    switch (folderName) {
      case 'iphone5':
        this.maskCover = `https://firebasestorage.googleapis.com/v0/b/shoutoutplay-d3392.appspot.com/o/intro%2Fiphone5%2Fiphone5.png?alt=media&token=19f4d403-9b21-47b6-9fdb-4fe646d03e26`;
        this.gifs = [
          'https://firebasestorage.googleapis.com/v0/b/shoutoutplay-d3392.appspot.com/o/intro%2Fiphone5%2F1-5.gif?alt=media&token=f6bbc2a5-4614-4e68-bf5e-6328b069d65f',
          'https://firebasestorage.googleapis.com/v0/b/shoutoutplay-d3392.appspot.com/o/intro%2Fiphone5%2F2-5.gif?alt=media&token=71586bff-c139-4b0c-be9d-c3f1f23673e9',
          'https://firebasestorage.googleapis.com/v0/b/shoutoutplay-d3392.appspot.com/o/intro%2Fiphone5%2F3-5.gif?alt=media&token=2c2a7947-5af8-4b69-a123-81f0cfbc345d',
          'https://firebasestorage.googleapis.com/v0/b/shoutoutplay-d3392.appspot.com/o/intro%2Fiphone5%2F4-5.gif?alt=media&token=5638abee-c2ba-471c-b152-1b5fd65e38be'
        ];
        break;
      case 'iphone6':
        this.maskCover = `https://firebasestorage.googleapis.com/v0/b/shoutoutplay-d3392.appspot.com/o/intro%2Fiphone6%2Fiphone6.png?alt=media&token=299bf78a-159d-432a-95fa-41332fe139df`;
        this.gifs = [
          'https://firebasestorage.googleapis.com/v0/b/shoutoutplay-d3392.appspot.com/o/intro%2Fiphone6%2F1.gif?alt=media&token=d7d28a62-e5b4-41d0-baf4-9dd9c4c15dd5',
          'https://firebasestorage.googleapis.com/v0/b/shoutoutplay-d3392.appspot.com/o/intro%2Fiphone6%2F2.gif?alt=media&token=0e9ad170-f403-4202-939d-3f6da98dfb8f',
          'https://firebasestorage.googleapis.com/v0/b/shoutoutplay-d3392.appspot.com/o/intro%2Fiphone6%2F3.gif?alt=media&token=c1071ff9-13a8-4301-9d6d-839f74e149d7',
          'https://firebasestorage.googleapis.com/v0/b/shoutoutplay-d3392.appspot.com/o/intro%2Fiphone6%2F4.gif?alt=media&token=ebf09493-9fdc-426a-b2f2-03321d5e5121'
        ];
        break;
      case 'iphone6plus':
        this.maskCover = `https://firebasestorage.googleapis.com/v0/b/shoutoutplay-d3392.appspot.com/o/intro%2Fiphone6plus%2Fiphone6plus.png?alt=media&token=8a6e34ae-826d-4ee7-acd7-b7a007795a30`;
        this.gifs = [
          'https://firebasestorage.googleapis.com/v0/b/shoutoutplay-d3392.appspot.com/o/intro%2Fiphone6plus%2F1-plus.gif?alt=media&token=0bdac782-2786-4a44-ae59-eed5f9f26371',
          'https://firebasestorage.googleapis.com/v0/b/shoutoutplay-d3392.appspot.com/o/intro%2Fiphone6plus%2F2-plus.gif?alt=media&token=ca4fa654-71ad-46b7-8e65-51497aaae08d',
          'https://firebasestorage.googleapis.com/v0/b/shoutoutplay-d3392.appspot.com/o/intro%2Fiphone6plus%2F3-plus.gif?alt=media&token=4d3c7b0c-ed41-442a-a59a-583ea90966f0',
          'https://firebasestorage.googleapis.com/v0/b/shoutoutplay-d3392.appspot.com/o/intro%2Fiphone6plus%2F4-plus.gif?alt=media&token=9364e753-096b-496c-a82f-f5565b533c4f'
        ];
        break;
    }
    // for (let i = 0; i < 4; i++) {
    //   this.gifs.push(`${path}${i + 1}${gifSuffix}`);
    // }
  }

  private gifControl(step: number) {
    setTimeout(() => {
      for (var i = 0; i < 4; i++) {
        if (i === step) {
          this[`_step${step + 1}`].start();
        } else {
          let stepCmp = this[`_step${i + 1}`];
          if (stepCmp) stepCmp.stop();
        }
      }
    }, 100);
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
      if (this._step1 && this._step1.stop) this._step1.stop();
      if (this._step2 && this._step1.stop) this._step2.stop();
      if (this._step3 && this._step1.stop) this._step3.stop();
      if (this._step4 && this._step1.stop) this._step4.stop();
    }, 500);

    if (isIOS) {
      // setup swipe label mask
      let maskLayer = CALayer.layer();
      // Mask image ends with 0.15 opacity on both sides. Set the background color of the layer
      // to the same value so the layer can extend the mask image.
      maskLayer.backgroundColor = UIColor.colorWithRedGreenBlueAlpha(0,0,0,.15).CGColor;
      maskLayer.contents = UIImage.imageNamed('SwipeMask.png').CGImage;

      // Center the mask image on twice the width of the text layer, so it starts to the left
      // of the text layer and moves to its right when we translate it by width.
      let myLabel = this.swipelabel.nativeElement.ios;
      maskLayer.contentsGravity = kCAGravityCenter;
      maskLayer.frame = CGRectMake(300, -50, 900, 150);

      let maskAnim = CABasicAnimation.animationWithKeyPath('position.x');
      maskAnim.fromValue = 300;
      maskAnim.toValue = -100;
      maskAnim.repeatCount = 10000000;
      maskAnim.duration = 4.5;
      maskAnim.timingFunction = CAMediaTimingFunction.functionWithName(kCAMediaTimingFunctionEaseInEaseOut);

      maskLayer.addAnimationForKey(maskAnim, 'slideAnim');
      myLabel.layer.mask = maskLayer;
    }    

  }
}