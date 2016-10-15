
interface GCAcceleration {
	x: number;
	y: number;
	z: number;
}
declare var GCAcceleration: interop.StructType<GCAcceleration>;

declare class GCController extends NSObject {

	static alloc(): GCController; // inherited from NSObject

	static controllers(): NSArray<GCController>;

	static new(): GCController; // inherited from NSObject

	static startWirelessControllerDiscoveryWithCompletionHandler(completionHandler: () => void): void;

	static stopWirelessControllerDiscovery(): void;

	/* readonly */ attachedToDevice: boolean;

	controllerPausedHandler: (p1: GCController) => void;

	/* readonly */ extendedGamepad: GCExtendedGamepad;

	/* readonly */ gamepad: GCGamepad;

	handlerQueue: NSObject;

	/* readonly */ microGamepad: GCMicroGamepad;

	/* readonly */ motion: GCMotion;

	playerIndex: GCControllerPlayerIndex;

	/* readonly */ vendorName: string;
}

declare class GCControllerAxisInput extends GCControllerElement {

	static alloc(): GCControllerAxisInput; // inherited from NSObject

	static new(): GCControllerAxisInput; // inherited from NSObject

	/* readonly */ value: number;

	valueChangedHandler: (p1: GCControllerAxisInput, p2: number) => void;
}

declare class GCControllerButtonInput extends GCControllerElement {

	static alloc(): GCControllerButtonInput; // inherited from NSObject

	static new(): GCControllerButtonInput; // inherited from NSObject

	/* readonly */ pressed: boolean;

	pressedChangedHandler: (p1: GCControllerButtonInput, p2: number, p3: boolean) => void;

	/* readonly */ value: number;

	valueChangedHandler: (p1: GCControllerButtonInput, p2: number, p3: boolean) => void;
}

declare var GCControllerDidConnectNotification: string;

declare var GCControllerDidDisconnectNotification: string;

declare class GCControllerDirectionPad extends GCControllerElement {

	static alloc(): GCControllerDirectionPad; // inherited from NSObject

	static new(): GCControllerDirectionPad; // inherited from NSObject

	/* readonly */ down: GCControllerButtonInput;

	/* readonly */ left: GCControllerButtonInput;

	/* readonly */ right: GCControllerButtonInput;

	/* readonly */ up: GCControllerButtonInput;

	valueChangedHandler: (p1: GCControllerDirectionPad, p2: number, p3: number) => void;

	/* readonly */ xAxis: GCControllerAxisInput;

	/* readonly */ yAxis: GCControllerAxisInput;
}

declare class GCControllerElement extends NSObject {

	static alloc(): GCControllerElement; // inherited from NSObject

	static new(): GCControllerElement; // inherited from NSObject

	/* readonly */ analog: boolean;

	/* readonly */ collection: GCControllerElement;
}

declare const enum GCControllerPlayerIndex {

	IndexUnset = -1,

	Index1 = 0,

	Index2 = 1,

	Index3 = 2,

	Index4 = 3
}

interface GCEulerAngles {
	pitch: number;
	yaw: number;
	roll: number;
}
declare var GCEulerAngles: interop.StructType<GCEulerAngles>;

declare class GCEventViewController extends UIViewController {

	static alloc(): GCEventViewController; // inherited from NSObject

	static new(): GCEventViewController; // inherited from NSObject

	controllerUserInteractionEnabled: boolean;
}

declare class GCExtendedGamepad extends NSObject {

	static alloc(): GCExtendedGamepad; // inherited from NSObject

	static new(): GCExtendedGamepad; // inherited from NSObject

	/* readonly */ buttonA: GCControllerButtonInput;

	/* readonly */ buttonB: GCControllerButtonInput;

	/* readonly */ buttonX: GCControllerButtonInput;

	/* readonly */ buttonY: GCControllerButtonInput;

	/* readonly */ controller: GCController;

	/* readonly */ dpad: GCControllerDirectionPad;

	/* readonly */ leftShoulder: GCControllerButtonInput;

	/* readonly */ leftThumbstick: GCControllerDirectionPad;

	/* readonly */ leftTrigger: GCControllerButtonInput;

	/* readonly */ rightShoulder: GCControllerButtonInput;

	/* readonly */ rightThumbstick: GCControllerDirectionPad;

	/* readonly */ rightTrigger: GCControllerButtonInput;

	valueChangedHandler: (p1: GCExtendedGamepad, p2: GCControllerElement) => void;

	saveSnapshot(): GCExtendedGamepadSnapshot;
}

interface GCExtendedGamepadSnapShotDataV100 {
	version: number;
	size: number;
	dpadX: number;
	dpadY: number;
	buttonA: number;
	buttonB: number;
	buttonX: number;
	buttonY: number;
	leftShoulder: number;
	rightShoulder: number;
	leftThumbstickX: number;
	leftThumbstickY: number;
	rightThumbstickX: number;
	rightThumbstickY: number;
	leftTrigger: number;
	rightTrigger: number;
}
declare var GCExtendedGamepadSnapShotDataV100: interop.StructType<GCExtendedGamepadSnapShotDataV100>;

declare function GCExtendedGamepadSnapShotDataV100FromNSData(snapshotData: interop.Pointer | interop.Reference<GCExtendedGamepadSnapShotDataV100>, data: NSData): boolean;

declare class GCExtendedGamepadSnapshot extends GCExtendedGamepad {

	static alloc(): GCExtendedGamepadSnapshot; // inherited from NSObject

	static new(): GCExtendedGamepadSnapshot; // inherited from NSObject

	snapshotData: NSData;

	constructor(o: { controller: GCController; snapshotData: NSData; });

	constructor(o: { snapshotData: NSData; });

	initWithControllerSnapshotData(controller: GCController, data: NSData): this;

	initWithSnapshotData(data: NSData): this;
}

declare class GCGamepad extends NSObject {

	static alloc(): GCGamepad; // inherited from NSObject

	static new(): GCGamepad; // inherited from NSObject

	/* readonly */ buttonA: GCControllerButtonInput;

	/* readonly */ buttonB: GCControllerButtonInput;

	/* readonly */ buttonX: GCControllerButtonInput;

	/* readonly */ buttonY: GCControllerButtonInput;

	/* readonly */ controller: GCController;

	/* readonly */ dpad: GCControllerDirectionPad;

	/* readonly */ leftShoulder: GCControllerButtonInput;

	/* readonly */ rightShoulder: GCControllerButtonInput;

	valueChangedHandler: (p1: GCGamepad, p2: GCControllerElement) => void;

	saveSnapshot(): GCGamepadSnapshot;
}

interface GCGamepadSnapShotDataV100 {
	version: number;
	size: number;
	dpadX: number;
	dpadY: number;
	buttonA: number;
	buttonB: number;
	buttonX: number;
	buttonY: number;
	leftShoulder: number;
	rightShoulder: number;
}
declare var GCGamepadSnapShotDataV100: interop.StructType<GCGamepadSnapShotDataV100>;

declare function GCGamepadSnapShotDataV100FromNSData(snapshotData: interop.Pointer | interop.Reference<GCGamepadSnapShotDataV100>, data: NSData): boolean;

declare class GCGamepadSnapshot extends GCGamepad {

	static alloc(): GCGamepadSnapshot; // inherited from NSObject

	static new(): GCGamepadSnapshot; // inherited from NSObject

	snapshotData: NSData;

	constructor(o: { controller: GCController; snapshotData: NSData; });

	constructor(o: { snapshotData: NSData; });

	initWithControllerSnapshotData(controller: GCController, data: NSData): this;

	initWithSnapshotData(data: NSData): this;
}

declare class GCMicroGamepad extends NSObject {

	static alloc(): GCMicroGamepad; // inherited from NSObject

	static new(): GCMicroGamepad; // inherited from NSObject

	allowsRotation: boolean;

	/* readonly */ buttonA: GCControllerButtonInput;

	/* readonly */ buttonX: GCControllerButtonInput;

	/* readonly */ controller: GCController;

	/* readonly */ dpad: GCControllerDirectionPad;

	reportsAbsoluteDpadValues: boolean;

	valueChangedHandler: (p1: GCMicroGamepad, p2: GCControllerElement) => void;

	saveSnapshot(): GCMicroGamepadSnapshot;
}

interface GCMicroGamepadSnapShotDataV100 {
	version: number;
	size: number;
	dpadX: number;
	dpadY: number;
	buttonA: number;
	buttonX: number;
}
declare var GCMicroGamepadSnapShotDataV100: interop.StructType<GCMicroGamepadSnapShotDataV100>;

declare function GCMicroGamepadSnapShotDataV100FromNSData(snapshotData: interop.Pointer | interop.Reference<GCMicroGamepadSnapShotDataV100>, data: NSData): boolean;

declare class GCMicroGamepadSnapshot extends GCMicroGamepad {

	static alloc(): GCMicroGamepadSnapshot; // inherited from NSObject

	static new(): GCMicroGamepadSnapshot; // inherited from NSObject

	snapshotData: NSData;

	constructor(o: { controller: GCController; snapshotData: NSData; });

	constructor(o: { snapshotData: NSData; });

	initWithControllerSnapshotData(controller: GCController, data: NSData): this;

	initWithSnapshotData(data: NSData): this;
}

declare class GCMotion extends NSObject {

	static alloc(): GCMotion; // inherited from NSObject

	static new(): GCMotion; // inherited from NSObject

	/* readonly */ attitude: GCQuaternion;

	/* readonly */ controller: GCController;

	/* readonly */ gravity: GCAcceleration;

	/* readonly */ rotationRate: GCRotationRate;

	/* readonly */ userAcceleration: GCAcceleration;

	valueChangedHandler: (p1: GCMotion) => void;
}

interface GCQuaternion {
	x: number;
	y: number;
	z: number;
	w: number;
}
declare var GCQuaternion: interop.StructType<GCQuaternion>;

interface GCRotationRate {
	x: number;
	y: number;
	z: number;
}
declare var GCRotationRate: interop.StructType<GCRotationRate>;

declare function NSDataFromGCExtendedGamepadSnapShotDataV100(snapshotData: interop.Pointer | interop.Reference<GCExtendedGamepadSnapShotDataV100>): NSData;

declare function NSDataFromGCGamepadSnapShotDataV100(snapshotData: interop.Pointer | interop.Reference<GCGamepadSnapShotDataV100>): NSData;

declare function NSDataFromGCMicroGamepadSnapShotDataV100(snapshotData: interop.Pointer | interop.Reference<GCMicroGamepadSnapShotDataV100>): NSData;
