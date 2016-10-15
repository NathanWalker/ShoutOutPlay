
declare class ASIdentifierManager extends NSObject {

	static alloc(): ASIdentifierManager; // inherited from NSObject

	static new(): ASIdentifierManager; // inherited from NSObject

	static sharedManager(): ASIdentifierManager;

	/* readonly */ advertisingIdentifier: NSUUID;

	/* readonly */ advertisingTrackingEnabled: boolean;
}
