declare var MPNowPlayingInfoCenter, interop;
/**
 * iOS Control Center integration (lock screen and bottom fly up)
 */
export class CommandCenterHandler extends NSObject {
	private _owner: WeakRef<any>;
	private selected = false;

	public static initWithOwner(owner: WeakRef<any>): CommandCenterHandler {
		let handler = <CommandCenterHandler>CommandCenterHandler.new();
    handler._owner = owner;
    UIApplication.sharedApplication().beginReceivingRemoteControlEvents();
		return handler;
	}

	public cmdPause(args) {
    let owner = <any>this._owner.get();
    console.log(`CommandCenterHandler cmdPause`);
    owner.cmdTogglePlay(false);
  }
  
  public cmdPlay(args) {
    let owner = <any>this._owner.get();
    console.log(`CommandCenterHandler cmdPlay`);
    owner.cmdTogglePlay(true);
  }
  
  public cmdStop(args) {
    let owner = <any>this._owner.get();
    console.log(`CommandCenterHandler cmdStop`);
    owner.cmdTogglePlay(false);
	}

  public cmdTogglePlay(args) {
    let owner = <any>this._owner.get();
    console.log(`CommandCenterHandler cmdTogglePlay`);
    owner.cmdTogglePlay();
  }
  
  public cmdNext(args) {
    let owner = <any>this._owner.get();
    console.log(`CommandCenterHandler cmdNext`);
    owner.cmdPrevNext(1);
  }
  
  public cmdPrev(args) {
    let owner = <any>this._owner.get();
    console.log(`CommandCenterHandler cmdPrev`);
    owner.cmdPrevNext(0);
  }
  
  public cmdSeekFwd(args) {
    let owner = <any>this._owner.get();
    console.log(`CommandCenterHandler cmdSeekFwd`);
    owner.cmdSeek(args);
  }
  
  public cmdSeekBack(args) {
    let owner = <any>this._owner.get();
    console.log(`CommandCenterHandler cmdSeekBack`);
    owner.cmdSeek(args);
	}

	public static ObjCExposedMethods = {
    'cmdPause': { returns: interop.types.void, params: [interop.types.id] },
    'cmdPlay': { returns: interop.types.void, params: [interop.types.id] },
    'cmdStop': { returns: interop.types.void, params: [interop.types.id] },
    'cmdTogglePlay': { returns: interop.types.void, params: [interop.types.id] },
    'cmdNext': { returns: interop.types.void, params: [interop.types.id] },
    'cmdPrev': { returns: interop.types.void, params: [interop.types.id] },
    'cmdSeekFwd': { returns: interop.types.void, params: [interop.types.id] },
    'cmdSeekBack': { returns: interop.types.void, params: [interop.types.id] }
	};
}