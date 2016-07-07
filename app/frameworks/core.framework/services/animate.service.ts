import {GestureStateTypes} from 'ui/gestures';

export class AnimateService {

  public static SWIPE_SETTINGS: any = {
    MIN_X: -80,
    MAX_X: 80,
    THRESHOLD: 0.5
  }

  public static SWIPE_REVEAL(e: any): any {
    let swipeConfig = AnimateService.SWIPE_SETTINGS;
    let overlayView = e.object;
    let newX = overlayView.translateX + e.deltaX;
    if (newX >= swipeConfig.MIN_X && newX <= swipeConfig.MAX_X) {
      overlayView.translateX = newX;
    }
    if (e.state === GestureStateTypes.ended && !(newX == swipeConfig.MIN_X)) {
      let destX = 0;
      if (newX <= swipeConfig.MIN_X * swipeConfig.THRESHOLD) {
        destX = swipeConfig.MIN_X;
      } else if (newX >= swipeConfig.MAX_X * swipeConfig.THRESHOLD) {
        destX = swipeConfig.MAX_X;
      }
      overlayView.animate({
        translate: { x: destX, y: 0 },
        duration: 200
      });
    }
    return overlayView;
  }

  public static SWIPE_RESET(view: any) {
    view.animate({
      translate: { x: 0, y: 0 },
      duration: 200
    });
  }
}
