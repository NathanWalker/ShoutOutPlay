// angular
import {Injectable, NgZone} from '@angular/core';

// libs
import {Store} from '@ngrx/store';

// nativescript
import {Color} from 'color';
import {isIOS} from 'platform';
import * as dialogs from 'ui/dialogs';

var TNSFancyAlert, TNSFancyAlertButton;

if (isIOS) {
  var fAlerts = require('nativescript-fancyalert');
  TNSFancyAlert = fAlerts.TNSFancyAlert;
  TNSFancyAlertButton = fAlerts.TNSFancyAlertButton;
} else {
  // android
  TNSFancyAlertButton = (function () {
    function TNSFancyAlertButton(model) {
        if (model) {
            this.label = model.label;
            this.action = model.action;
        }
    }
    return TNSFancyAlertButton;
  }());
}

// app
import {ColorService} from './color.service';
import {PROGRESS_ACTIONS} from './progress.service';
declare var zonedCallback: Function, UIBezierPath, SCLAlertViewStyleKit, CGPointMake;

@Injectable()
export class FancyAlertService {
  private _plusImage: any;
  private _micImage: any;
  private _androidTimeout: number = 800;

  constructor(private store: Store<any>, private ngZone: NgZone) {

    if (isIOS) {
      TNSFancyAlert.titleColor = ColorService.Active.WHITE;
      TNSFancyAlert.bodyTextColor = ColorService.Active.WHITE;
      TNSFancyAlert.shouldDismissOnTapOutside = true;
    } else {
      // android
    }
  }

  public show(message: string) {

    if (isIOS) {
      this.setColors(ColorService.ActiveId == 0 ? ColorService.Active.HIGHLIGHT : ColorService.Active.BRIGHT_ALT);
      TNSFancyAlert.showAnimationType = TNSFancyAlert.SHOW_ANIMATION_TYPES.SlideInFromCenter;
      TNSFancyAlert.hideAnimationType = TNSFancyAlert.HIDE_ANIMATION_TYPES.SlideOutToCenter;

      TNSFancyAlert.showInfo(null, message);
    } else {

      // ensure a progress dialog (loading-indicator) is always closed *before* opening a dialog
      this.closeProgress();
      setTimeout(() => {
        dialogs.alert(message).then(() => {
          // ignore
        }, () => {
          // ignore
        });
      }, this._androidTimeout);
    }
  }

  public prompt(placeholder: string, initialValue: string, title: string, image: string, action: Function) {
    console.log('fancyalert.prompt...'); 

    if (isIOS) {
      this.setColors(ColorService.ActiveId == 0 ? ColorService.Active.PRIMARY : ColorService.Active.BRIGHT_ALT);
      this.defaultAnimation();

      TNSFancyAlert.showTextField(
        placeholder,
        initialValue,
        new TNSFancyAlertButton({
          label: 'Save',
          action: (value: any) => {
            if (value) {
              console.log(`User entered ${value}`);
              this.ngZone.run(() => {
                action(value);
              });
            }
          }
        }),
        this.getAlertImage(image),
        ColorService.Active.WHITE,
        title
      );
    } else {

      // this.closeProgress();
      setTimeout(() => {
        let options = {
          title: title,
          defaultText: initialValue || '',
          inputType: dialogs.inputType.text,
          okButtonText: 'Save',
          cancelButtonText: 'Cancel'
        };
        this.ngZone.run(() => {
          console.log('calling dialogs.prompt with options:');
          console.log(options);
          // console.log('dialogs.prompt:');
          // console.log(dialogs.prompt);
          dialogs.prompt(options).then((result: any) => {
            if (result && result.text) {
              console.log(`User entered ${result.text}`);
              this.ngZone.run(() => {
                action(result.text);
              });
            }
          }, () => {
            // canceled
          });
        });
      }, this._androidTimeout);

    }
  } 

  public confirm(subTitle: string, image: string, action: Function) {

    if (isIOS) {
      this.setColors(ColorService.Active.RED);
      TNSFancyAlert.showAnimationType = TNSFancyAlert.SHOW_ANIMATION_TYPES.SlideInFromCenter;
      TNSFancyAlert.hideAnimationType = TNSFancyAlert.HIDE_ANIMATION_TYPES.SlideOutFromCenter;

      TNSFancyAlert.showCustomButtons([
        new TNSFancyAlertButton({
          label: 'Yes',
          action: () => {
            this.ngZone.run(() => {
              action();
            });
          }
        })],
        this.getAlertImage(image),
        ColorService.Active.WHITE,
        'Confirm',
        subTitle
      );
    } else {

      this.closeProgress();      
      setTimeout(() => {
        this.ngZone.run(() => {
          dialogs.confirm(subTitle).then((result: boolean) => {
            if (result) {
              this.ngZone.run(() => {
                action();
              });
            }
          }, () => {
            // ignore
          });
        })
      }, this._androidTimeout);
    }
  } 

  public action(title: string, subTitle: string, image: string, buttons: Array<any>) {
    console.log('fancyalert.action...'); 
    if (isIOS) {
      this.setColors(ColorService.ActiveId == 0 ? ColorService.Active.PRIMARY : ColorService.Active.BRIGHT_ALT);
      TNSFancyAlert.showAnimationType = TNSFancyAlert.SHOW_ANIMATION_TYPES.SlideInFromRight;
      TNSFancyAlert.hideAnimationType = TNSFancyAlert.HIDE_ANIMATION_TYPES.SlideOutToRight;

      let btns = [];
      for (let b of buttons) {
        btns.push(new TNSFancyAlertButton({
          label: b.label,
          action: () => {
            console.log(`User chose ${b.label}`);
            this.ngZone.run(() => {
              b.action();
            });
          }
        }));
      }
      TNSFancyAlert.showCustomButtons(
        btns,
        this.getAlertImage(image),
        ColorService.Active.WHITE,
        title,
        subTitle
      );
    } else {
      console.log(dialogs); 

      this.closeProgress();
      setTimeout(() => {
        this.ngZone.run(() => {
          dialogs.action({
            message: title,
            cancelButtonText: "Cancel",
            actions: buttons.map(b => b.label)
          }).then((result: any) => {
            console.log(`User chose ${result}`);
            setTimeout(() => {
              for (let b of buttons) {
                if (b.label === result) {
                  this.ngZone.run(() => {
                    b.action();
                  });
                  break;
                }
              }
            }, this._androidTimeout);
          }, () => {
            // ignore
          });
        });
      }, this._androidTimeout);
    }
  } 

  private closeProgress() {
    this.store.dispatch({type: PROGRESS_ACTIONS.HIDE });
  }

  private setColors(highlight: string) {
    if (isIOS) {
      TNSFancyAlert.customViewColor = highlight;
      TNSFancyAlert.backgroundViewColor = ColorService.Active.COMPLIMENTARY;
    }
  }

  private getAlertImage(image: string) {
    switch (image) {
      case 'plus':
        return this.imageOfPlus();
      case 'microphone':
        return this.imageOfMicrophone();

      // TODO: create static enums in TNSFancyAlert plugin for these
      case 'edit':
        return SCLAlertViewStyleKit.imageOfEdit();
      case 'warning':
        return SCLAlertViewStyleKit.imageOfWarning();
      case 'question':
        return SCLAlertViewStyleKit.imageOfQuestion();
    }
  }

  private imageOfPlus() {
    if (this._plusImage)
      return this._plusImage;
    
    UIGraphicsBeginImageContextWithOptions(CGSizeMake(80, 80), false, 0);
    this.drawPlus();
    this._plusImage = UIGraphicsGetImageFromCurrentImageContext();
    UIGraphicsEndImageContext();
    
    return this._plusImage;
  }

  private drawPlus() {
    let iconColor = new Color(ColorService.Active.COMPLIMENTARY).ios;
      
    //// Bezier Drawing
    let bezierPath = UIBezierPath.bezierPath();
    bezierPath.moveToPoint(CGPointMake(35.72, 15));
    bezierPath.addLineToPoint(CGPointMake(44.35, 15));
    bezierPath.addLineToPoint(CGPointMake(44.35, 35.65));
    bezierPath.addLineToPoint(CGPointMake(65, 35.65));
    bezierPath.addLineToPoint(CGPointMake(65, 43.89));
    bezierPath.addLineToPoint(CGPointMake(44.35, 43.89));
    bezierPath.addLineToPoint(CGPointMake(44.35, 65));
    bezierPath.addLineToPoint(CGPointMake(35.72, 65));
    bezierPath.addLineToPoint(CGPointMake(35.72, 43.89));
    bezierPath.addLineToPoint(CGPointMake(15, 43.89));
    bezierPath.addLineToPoint(CGPointMake(15, 35.65));
    bezierPath.addLineToPoint(CGPointMake(35.72, 35.65));
    bezierPath.addLineToPoint(CGPointMake(35.72, 15));
    bezierPath.closePath();
    iconColor.setFill();
    bezierPath.fill();
  }

  private imageOfMicrophone() {
    if (this._micImage)
      return this._micImage;
    
    UIGraphicsBeginImageContextWithOptions(CGSizeMake(80, 80), false, 0);
    this.drawMic();
    this._micImage = UIGraphicsGetImageFromCurrentImageContext();
    UIGraphicsEndImageContext();
    
    return this._micImage;
  }

  private drawMic() {
    let iconColor = new Color(ColorService.ActiveId == 0 ? ColorService.Active.BRIGHT : ColorService.Active.WHITE).ios;
      
    //// Bezier Drawing
    let bezierPath = UIBezierPath.bezierPath();
    bezierPath.moveToPoint(CGPointMake(49.38, 65.09));
    bezierPath.addCurveToPointControlPoint1ControlPoint2(CGPointMake(49.37, 64.91), CGPointMake(49.38, 65.03), CGPointMake(49.36, 64.97));
    bezierPath.addCurveToPointControlPoint1ControlPoint2(CGPointMake(48.28, 63.08), CGPointMake(49.46, 64.02), CGPointMake(49.02, 63.43));
    bezierPath.addCurveToPointControlPoint1ControlPoint2(CGPointMake(46.25, 62.31), CGPointMake(47.63, 62.77), CGPointMake(46.95, 62.49));
    bezierPath.addCurveToPointControlPoint1ControlPoint2(CGPointMake(41.8, 61.72), CGPointMake(44.8, 61.92), CGPointMake(43.3, 61.79));
    bezierPath.addCurveToPointControlPoint1ControlPoint2(CGPointMake(41.36, 61.27), CGPointMake(41.41, 61.71), CGPointMake(41.36, 61.67));
    bezierPath.addCurveToPointControlPoint1ControlPoint2(CGPointMake(41.35, 58.29), CGPointMake(41.36, 60.28), CGPointMake(41.36, 59.28));
    bezierPath.addCurveToPointControlPoint1ControlPoint2(CGPointMake(41.73, 57.84), CGPointMake(41.35, 58), CGPointMake(41.44, 57.87));
    bezierPath.addCurveToPointControlPoint1ControlPoint2(CGPointMake(43.11, 57.63), CGPointMake(42.19, 57.79), CGPointMake(42.65, 57.73));
    bezierPath.addCurveToPointControlPoint1ControlPoint2(CGPointMake(52.47, 51.24), CGPointMake(47.09, 56.79), CGPointMake(50.2, 54.62));
    bezierPath.addCurveToPointControlPoint1ControlPoint2(CGPointMake(54.89, 43.29), CGPointMake(54.07, 48.85), CGPointMake(54.9, 46.2));
    bezierPath.addCurveToPointControlPoint1ControlPoint2(CGPointMake(53.69, 42.08), CGPointMake(54.88, 42.57), CGPointMake(54.38, 42.08));
    bezierPath.addCurveToPointControlPoint1ControlPoint2(CGPointMake(52.48, 43.28), CGPointMake(53.01, 42.07), CGPointMake(52.52, 42.57));
    bezierPath.addCurveToPointControlPoint1ControlPoint2(CGPointMake(52.36, 44.94), CGPointMake(52.45, 43.83), CGPointMake(52.43, 44.39));
    bezierPath.addCurveToPointControlPoint1ControlPoint2(CGPointMake(47.94, 52.9), CGPointMake(51.93, 48.18), CGPointMake(50.51, 50.89));
    bezierPath.addCurveToPointControlPoint1ControlPoint2(CGPointMake(37.79, 55.16), CGPointMake(44.92, 55.24), CGPointMake(41.48, 55.95));
    bezierPath.addCurveToPointControlPoint1ControlPoint2(CGPointMake(29.38, 48.23), CGPointMake(33.84, 54.31), CGPointMake(31.02, 51.97));
    bezierPath.addCurveToPointControlPoint1ControlPoint2(CGPointMake(28.39, 43.44), CGPointMake(28.71, 46.71), CGPointMake(28.43, 45.1));
    bezierPath.addCurveToPointControlPoint1ControlPoint2(CGPointMake(27.18, 42.08), CGPointMake(28.36, 42.59), CGPointMake(27.91, 42.08));
    bezierPath.addCurveToPointControlPoint1ControlPoint2(CGPointMake(25.99, 43.49), CGPointMake(26.43, 42.09), CGPointMake(25.97, 42.62));
    bezierPath.addCurveToPointControlPoint1ControlPoint2(CGPointMake(26.08, 44.99), CGPointMake(26, 43.99), CGPointMake(26.01, 44.49));
    bezierPath.addCurveToPointControlPoint1ControlPoint2(CGPointMake(33.92, 56.26), CGPointMake(26.82, 50.08), CGPointMake(29.5, 53.8));
    bezierPath.addCurveToPointControlPoint1ControlPoint2(CGPointMake(39.12, 57.84), CGPointMake(35.54, 57.16), CGPointMake(37.29, 57.65));
    bezierPath.addCurveToPointControlPoint1ControlPoint2(CGPointMake(39.53, 58.29), CGPointMake(39.41, 57.87), CGPointMake(39.53, 57.98));
    bezierPath.addCurveToPointControlPoint1ControlPoint2(CGPointMake(39.53, 61.3), CGPointMake(39.51, 59.29), CGPointMake(39.51, 60.29));
    bezierPath.addCurveToPointControlPoint1ControlPoint2(CGPointMake(39.1, 61.73), CGPointMake(39.53, 61.61), CGPointMake(39.4, 61.71));
    bezierPath.addCurveToPointControlPoint1ControlPoint2(CGPointMake(35.87, 62.06), CGPointMake(38.02, 61.82), CGPointMake(36.94, 61.91));
    bezierPath.addCurveToPointControlPoint1ControlPoint2(CGPointMake(32.48, 63.14), CGPointMake(34.69, 62.22), CGPointMake(33.53, 62.5));
    bezierPath.addCurveToPointControlPoint1ControlPoint2(CGPointMake(31.51, 64.82), CGPointMake(31.86, 63.52), CGPointMake(31.43, 64.02));
    bezierPath.addCurveToPointControlPoint1ControlPoint2(CGPointMake(31.49, 65.1), CGPointMake(31.51, 64.91), CGPointMake(31.5, 65.01));
    bezierPath.miterLimit = 4;
    bezierPath.closePath();
    iconColor.setFill();
    bezierPath.fill();

    let bezier2Path = UIBezierPath.bezierPath();
    bezier2Path.moveToPoint(CGPointMake(40.38, 14.91));
    bezier2Path.addCurveToPointControlPoint1ControlPoint2(CGPointMake(39.43, 15.01), CGPointMake(40.07, 14.94), CGPointMake(39.75, 14.97));
    bezier2Path.addCurveToPointControlPoint1ControlPoint2(CGPointMake(31.07, 24.5), CGPointMake(34.66, 15.56), CGPointMake(31.04, 19.85));
    bezier2Path.addCurveToPointControlPoint1ControlPoint2(CGPointMake(31.09, 42.7), CGPointMake(31.12, 30.56), CGPointMake(31.09, 36.63));
    bezier2Path.addCurveToPointControlPoint1ControlPoint2(CGPointMake(31.13, 43.76), CGPointMake(31.09, 43.06), CGPointMake(31.09, 43.41));
    bezier2Path.addCurveToPointControlPoint1ControlPoint2(CGPointMake(34.24, 49.8), CGPointMake(31.41, 46.17), CGPointMake(32.46, 48.19));
    bezier2Path.addCurveToPointControlPoint1ControlPoint2(CGPointMake(41.66, 52.16), CGPointMake(36.36, 51.71), CGPointMake(38.84, 52.53));
    bezier2Path.addCurveToPointControlPoint1ControlPoint2(CGPointMake(47.48, 48.97), CGPointMake(43.99, 51.86), CGPointMake(45.93, 50.75));
    bezier2Path.addCurveToPointControlPoint1ControlPoint2(CGPointMake(49.8, 42.91), CGPointMake(48.97, 47.25), CGPointMake(49.8, 45.23));
    bezier2Path.addCurveToPointControlPoint1ControlPoint2(CGPointMake(49.8, 24.18), CGPointMake(49.8, 36.67), CGPointMake(49.8, 30.43));
    bezier2Path.addCurveToPointControlPoint1ControlPoint2(CGPointMake(49.75, 23.34), CGPointMake(49.8, 23.9), CGPointMake(49.78, 23.62));
    bezier2Path.addCurveToPointControlPoint1ControlPoint2(CGPointMake(41.77, 15.05), CGPointMake(49.3, 19.18), CGPointMake(45.85, 15.61));
    bezier2Path.addCurveToPointControlPoint1ControlPoint2(CGPointMake(41.14, 14.91), CGPointMake(41.56, 15.02), CGPointMake(41.34, 14.96));
    bezier2Path.miterLimit = 4;
    bezier2Path.closePath();
    iconColor.setFill();
    bezier2Path.fill();
  }

  private defaultAnimation() {
    TNSFancyAlert.showAnimationType = TNSFancyAlert.SHOW_ANIMATION_TYPES.SlideInFromTop;
    TNSFancyAlert.hideAnimationType = TNSFancyAlert.HIDE_ANIMATION_TYPES.SlideOutToBottom;
  }
}