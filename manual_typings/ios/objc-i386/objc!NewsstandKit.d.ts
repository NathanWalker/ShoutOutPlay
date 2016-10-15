
declare class NKAssetDownload extends NSObject {

	static alloc(): NKAssetDownload; // inherited from NSObject

	static new(): NKAssetDownload; // inherited from NSObject

	/* readonly */ URLRequest: NSURLRequest;

	/* readonly */ identifier: string;

	/* readonly */ issue: NKIssue;

	userInfo: NSDictionary<any, any>;

	downloadWithDelegate(delegate: NSURLConnectionDownloadDelegate): NSURLConnection;
}

declare class NKIssue extends NSObject {

	static alloc(): NKIssue; // inherited from NSObject

	static new(): NKIssue; // inherited from NSObject

	/* readonly */ contentURL: NSURL;

	/* readonly */ date: Date;

	/* readonly */ downloadingAssets: NSArray<NKAssetDownload>;

	/* readonly */ name: string;

	/* readonly */ status: NKIssueContentStatus;

	addAssetWithRequest(request: NSURLRequest): NKAssetDownload;
}

declare const enum NKIssueContentStatus {

	None = 0,

	Downloading = 1,

	Available = 2
}

declare var NKIssueDownloadCompletedNotification: string;

declare class NKLibrary extends NSObject {

	static alloc(): NKLibrary; // inherited from NSObject

	static new(): NKLibrary; // inherited from NSObject

	static sharedLibrary(): NKLibrary;

	currentlyReadingIssue: NKIssue;

	/* readonly */ downloadingAssets: NSArray<NKAssetDownload>;

	/* readonly */ issues: NSArray<NKIssue>;

	addIssueWithNameDate(name: string, date: Date): NKIssue;

	issueWithName(name: string): NKIssue;

	removeIssue(issue: NKIssue): void;
}
