// angular
import {Injectable, NgZone} from '@angular/core';

// nativescript
import {isIOS} from 'platform';
import {topmost} from 'ui/frame';
import {Color} from 'color';

// libs
import {Subscription} from 'rxjs/Subscription';
var TNSCoachMark, TNSCoachMarks;
if (isIOS) {
  let coachmarks = require('nativescript-coachmarks');
  TNSCoachMark = coachmarks.TNSCoachMark;
  TNSCoachMarks = coachmarks.TNSCoachMarks;
}

// app
import {LogService, ColorService, DrawerService} from '../../core/index';
import {AuthService, IAuthState} from './auth.service';

@Injectable()
export class CoachmarksService {
  private _searchBar: any;
  private _coachMarks: any;
  private _sub: Subscription;

  constructor(private authService: AuthService, private logger: LogService, private drawerService: DrawerService) {

  }

  public teachSearch(searchBar: any, force?: boolean) {
    if (isIOS) {
      if (!TNSCoachMarks.HAS_SHOWN()) {
        this._searchBar = searchBar;

        this._sub = this.authService.state$.subscribe((s:IAuthState) => {
          if (s.loggedIn) {
            this._sub.unsubscribe();

            setTimeout(() => {
              // configure instance to wire up events
              this._coachMarks = new TNSCoachMarks();
              // required: ensure your desire to setup events
              this._coachMarks.initEvents();
              this._coachMarks.events.on('willNavigate', (eventData) => {
                console.log(`will navigate to index:`);
                console.log(eventData.data.index);
                // you can customize buttons and bar at each step
                this.willNavTo(eventData.data);
              });
              this._coachMarks.events.on('navigate', (eventData) => {
                console.log(`navigated to index:`);
                console.log(eventData.data.index);
                // you can customize buttons and bar at each step
                this.navTo(eventData.data);
              });
              this._coachMarks.events.on('cleanup', (eventData) => {
                this._coachMarks = undefined;
              });
              
              let menu = topmost().ios.controller.visibleViewController.navigationItem.leftBarButtonItems[0].valueForKey('view').frame;
              this.logger.debug(menu);
              let record = topmost().ios.controller.visibleViewController.navigationItem.rightBarButtonItems[0].valueForKey('view').frame;  
              this.logger.debug(record);

              this.logger.debug(this._searchBar.ios);

              let marks = [
                new TNSCoachMark({
                  position: CGRectMake(
                    menu.origin.x - 5, 
                    menu.origin.y + 20, 
                    menu.size.width + 10, 
                    menu.size.height
                  ),
                  caption: 'Use the sidebar to change views.',
                  shape: TNSCoachMark.SHAPES.DEFAULT,
                  labelPosition: TNSCoachMark.LABEL_POSITIONS.BOTTOM,
                  labelAlignment: TNSCoachMark.LABEL_ALIGNMENTS.LEFT,
                  showArrow: true
                }),
                new TNSCoachMark({
                  position: CGRectMake(
                    record.origin.x - 5, 
                    record.origin.y + 20, 
                    record.size.width + 10, 
                    record.size.height
                  ),
                  caption: 'Use the mic to record anytime.',
                  shape: TNSCoachMark.SHAPES.DEFAULT,
                  labelPosition: TNSCoachMark.LABEL_POSITIONS.BOTTOM,
                  labelAlignment: TNSCoachMark.LABEL_ALIGNMENTS.RIGHT,
                  showArrow: true
                }),
                new TNSCoachMark({
                  position: CGRectMake(
                    this._searchBar.ios.frame.origin.x, 
                    this._searchBar.ios.frame.origin.y + 64, 
                    this._searchBar.ios.frame.size.width, 
                    this._searchBar.ios.frame.size.height
                  ),
                  caption: 'Start by searching for music to add to a playlist.',
                  shape: TNSCoachMark.SHAPES.DEFAULT,
                  labelPosition: TNSCoachMark.LABEL_POSITIONS.BOTTOM,
                  labelAlignment: TNSCoachMark.LABEL_ALIGNMENTS.RIGHT,
                  showArrow: true
                }),
                new TNSCoachMark({
                  position: CGRectMake(
                    0, 
                    150, 
                    1, 
                    1
                  ),
                  caption: `Oh! btw, don't like the purple color theme? Feel free to change it in the sidebar.`,
                  shape: TNSCoachMark.SHAPES.DEFAULT,
                  labelPosition: TNSCoachMark.LABEL_POSITIONS.BOTTOM,
                  labelAlignment: TNSCoachMark.LABEL_ALIGNMENTS.CENTER,
                  showArrow: false
                })
              ];


              TNSCoachMarks.start(
                marks,
                {
                  continueLabelText: 'Tap to Continue',
                  enableContinueLabel: true,
                  skipButtonText: 'Ok, Got It.',
                  lblSpacing: 15,
                  maxLblWidth: 210,
                  maskColor: ColorService.ActiveId == 0 ? UIColor.colorWithRedGreenBlueAlpha(0.49, 0.25, 0.91, .8) : UIColor.colorWithRedGreenBlueAlpha(0, 0, 0, .7),
                  persist: true
                },
                this._coachMarks
              );
            }, 600);
          }
        });
      }
    }
  }

  private willNavTo(data: any) {
    if (data.index == 0) {
      let menu = topmost().ios.controller.visibleViewController.navigationItem.leftBarButtonItems[0].valueForKey('view').frame;
      data.instance.arrowImage.frame = CGRectMake(menu.origin.x + 5, data.instance.arrowImage.frame.origin.y, data.instance.arrowImage.frame.size.width, data.instance.arrowImage.frame.size.height);
    } else if (data.index == 1) {
      // flip image
      // animate image change
      // let transition = CATransition.animation();
      // transition.duration = .3;
      // transition.timingFunction = CAMediaTimingFunction.functionWithName(kCAMediaTimingFunctionEaseInEaseOut);
      // transition.type = kCATransitionFade;
      // data.instance.arrowImage.layer.addAnimationForKey(transition, null);
      data.instance.arrowImage.image = UIImage.imageNamed('arrow-top-flip.png');

      let record = topmost().ios.controller.visibleViewController.navigationItem.rightBarButtonItems[0].valueForKey('view').frame; 
      data.instance.arrowImage.frame = CGRectMake(record.origin.x - 12, data.instance.arrowImage.frame.origin.y, data.instance.arrowImage.frame.size.width, data.instance.arrowImage.frame.size.height);
    } else if (data.index == 3) {
      data.instance.arrowImage.image = UIImage.imageNamed('arrow-left.png');
    }
  }

  private navTo(data: any) {
    if (data.instance.lblContinue) {
      // only available when 'ready' is called
      // it disappears after the first tap and advance to next step
      let labelContinue = data.instance.lblContinue.frame;
      data.instance.lblContinue.frame = CGRectMake(labelContinue.origin.x, labelContinue.origin.y - 20, labelContinue.size.width, labelContinue.size.height + 20);
      data.instance.lblContinue.backgroundColor = new Color(ColorService.Active.BRIGHT).ios; 
      
      // custom caption color
      data.instance.lblCaption.textColor = new Color('#fff').ios;

      // customize skip button
      let btnSkip = data.instance.btnSkipCoach.frame;
      data.instance.btnSkipCoach.frame = CGRectMake(btnSkip.origin.x, btnSkip.origin.y - 20, btnSkip.size.width, btnSkip.size.height + 20);
    }    
  }
}