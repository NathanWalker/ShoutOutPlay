
declare class MTLArgument extends NSObject {

	static alloc(): MTLArgument; // inherited from NSObject

	static new(): MTLArgument; // inherited from NSObject

	/* readonly */ access: MTLArgumentAccess;

	/* readonly */ active: boolean;

	/* readonly */ arrayLength: number;

	/* readonly */ bufferAlignment: number;

	/* readonly */ bufferDataSize: number;

	/* readonly */ bufferDataType: MTLDataType;

	/* readonly */ bufferStructType: MTLStructType;

	/* readonly */ index: number;

	/* readonly */ isDepthTexture: boolean;

	/* readonly */ name: string;

	/* readonly */ textureDataType: MTLDataType;

	/* readonly */ textureType: MTLTextureType;

	/* readonly */ threadgroupMemoryAlignment: number;

	/* readonly */ threadgroupMemoryDataSize: number;

	/* readonly */ type: MTLArgumentType;
}

declare const enum MTLArgumentAccess {

	ReadOnly = 0,

	ReadWrite = 1,

	WriteOnly = 2
}

declare const enum MTLArgumentType {

	Buffer = 0,

	ThreadgroupMemory = 1,

	Texture = 2,

	Sampler = 3
}

declare class MTLArrayType extends NSObject {

	static alloc(): MTLArrayType; // inherited from NSObject

	static new(): MTLArrayType; // inherited from NSObject

	/* readonly */ arrayLength: number;

	/* readonly */ elementType: MTLDataType;

	/* readonly */ stride: number;

	elementArrayType(): MTLArrayType;

	elementStructType(): MTLStructType;
}

declare class MTLAttribute extends NSObject {

	static alloc(): MTLAttribute; // inherited from NSObject

	static new(): MTLAttribute; // inherited from NSObject

	/* readonly */ active: boolean;

	/* readonly */ attributeIndex: number;

	/* readonly */ attributeType: MTLDataType;

	/* readonly */ name: string;

	/* readonly */ patchControlPointData: boolean;

	/* readonly */ patchData: boolean;
}

declare class MTLAttributeDescriptor extends NSObject implements NSCopying {

	static alloc(): MTLAttributeDescriptor; // inherited from NSObject

	static new(): MTLAttributeDescriptor; // inherited from NSObject

	bufferIndex: number;

	format: MTLAttributeFormat;

	offset: number;

	copyWithZone(zone: interop.Pointer | interop.Reference<any>): any;
}

declare class MTLAttributeDescriptorArray extends NSObject {

	static alloc(): MTLAttributeDescriptorArray; // inherited from NSObject

	static new(): MTLAttributeDescriptorArray; // inherited from NSObject
	[index: number]: MTLAttributeDescriptor;

	objectAtIndexedSubscript(index: number): MTLAttributeDescriptor;

	setObjectAtIndexedSubscript(attributeDesc: MTLAttributeDescriptor, index: number): void;
}

declare const enum MTLAttributeFormat {

	Invalid = 0,

	UChar2 = 1,

	UChar3 = 2,

	UChar4 = 3,

	Char2 = 4,

	Char3 = 5,

	Char4 = 6,

	UChar2Normalized = 7,

	UChar3Normalized = 8,

	UChar4Normalized = 9,

	Char2Normalized = 10,

	Char3Normalized = 11,

	Char4Normalized = 12,

	UShort2 = 13,

	UShort3 = 14,

	UShort4 = 15,

	Short2 = 16,

	Short3 = 17,

	Short4 = 18,

	UShort2Normalized = 19,

	UShort3Normalized = 20,

	UShort4Normalized = 21,

	Short2Normalized = 22,

	Short3Normalized = 23,

	Short4Normalized = 24,

	Half2 = 25,

	Half3 = 26,

	Half4 = 27,

	Float = 28,

	Float2 = 29,

	Float3 = 30,

	Float4 = 31,

	Int = 32,

	Int2 = 33,

	Int3 = 34,

	Int4 = 35,

	UInt = 36,

	UInt2 = 37,

	UInt3 = 38,

	UInt4 = 39,

	Int1010102Normalized = 40,

	UInt1010102Normalized = 41
}

declare const enum MTLBlendFactor {

	Zero = 0,

	One = 1,

	SourceColor = 2,

	OneMinusSourceColor = 3,

	SourceAlpha = 4,

	OneMinusSourceAlpha = 5,

	DestinationColor = 6,

	OneMinusDestinationColor = 7,

	DestinationAlpha = 8,

	OneMinusDestinationAlpha = 9,

	SourceAlphaSaturated = 10,

	BlendColor = 11,

	OneMinusBlendColor = 12,

	BlendAlpha = 13,

	OneMinusBlendAlpha = 14
}

declare const enum MTLBlendOperation {

	Add = 0,

	Subtract = 1,

	ReverseSubtract = 2,

	Min = 3,

	Max = 4
}

interface MTLBlitCommandEncoder extends MTLCommandEncoder {

	copyFromBufferSourceOffsetSourceBytesPerRowSourceBytesPerImageSourceSizeToTextureDestinationSliceDestinationLevelDestinationOrigin(sourceBuffer: MTLBuffer, sourceOffset: number, sourceBytesPerRow: number, sourceBytesPerImage: number, sourceSize: MTLSize, destinationTexture: MTLTexture, destinationSlice: number, destinationLevel: number, destinationOrigin: MTLOrigin): void;

	copyFromBufferSourceOffsetSourceBytesPerRowSourceBytesPerImageSourceSizeToTextureDestinationSliceDestinationLevelDestinationOriginOptions(sourceBuffer: MTLBuffer, sourceOffset: number, sourceBytesPerRow: number, sourceBytesPerImage: number, sourceSize: MTLSize, destinationTexture: MTLTexture, destinationSlice: number, destinationLevel: number, destinationOrigin: MTLOrigin, options: MTLBlitOption): void;

	copyFromBufferSourceOffsetToBufferDestinationOffsetSize(sourceBuffer: MTLBuffer, sourceOffset: number, destinationBuffer: MTLBuffer, destinationOffset: number, size: number): void;

	copyFromTextureSourceSliceSourceLevelSourceOriginSourceSizeToBufferDestinationOffsetDestinationBytesPerRowDestinationBytesPerImage(sourceTexture: MTLTexture, sourceSlice: number, sourceLevel: number, sourceOrigin: MTLOrigin, sourceSize: MTLSize, destinationBuffer: MTLBuffer, destinationOffset: number, destinationBytesPerRow: number, destinationBytesPerImage: number): void;

	copyFromTextureSourceSliceSourceLevelSourceOriginSourceSizeToBufferDestinationOffsetDestinationBytesPerRowDestinationBytesPerImageOptions(sourceTexture: MTLTexture, sourceSlice: number, sourceLevel: number, sourceOrigin: MTLOrigin, sourceSize: MTLSize, destinationBuffer: MTLBuffer, destinationOffset: number, destinationBytesPerRow: number, destinationBytesPerImage: number, options: MTLBlitOption): void;

	copyFromTextureSourceSliceSourceLevelSourceOriginSourceSizeToTextureDestinationSliceDestinationLevelDestinationOrigin(sourceTexture: MTLTexture, sourceSlice: number, sourceLevel: number, sourceOrigin: MTLOrigin, sourceSize: MTLSize, destinationTexture: MTLTexture, destinationSlice: number, destinationLevel: number, destinationOrigin: MTLOrigin): void;

	fillBufferRangeValue(buffer: MTLBuffer, range: NSRange, value: number): void;

	generateMipmapsForTexture(texture: MTLTexture): void;

	updateFence(fence: MTLFence): void;

	waitForFence(fence: MTLFence): void;
}
declare var MTLBlitCommandEncoder: {

	prototype: MTLBlitCommandEncoder;
};

declare const enum MTLBlitOption {

	None = 0,

	DepthFromDepthStencil = 1,

	StencilFromDepthStencil = 2,

	RowLinearPVRTC = 4
}

interface MTLBuffer extends MTLResource {

	length: number;

	addDebugMarkerRange(marker: string, range: NSRange): void;

	contents(): interop.Pointer | interop.Reference<any>;

	newTextureWithDescriptorOffsetBytesPerRow(descriptor: MTLTextureDescriptor, offset: number, bytesPerRow: number): MTLTexture;

	removeAllDebugMarkers(): void;
}
declare var MTLBuffer: {

	prototype: MTLBuffer;
};

declare class MTLBufferLayoutDescriptor extends NSObject implements NSCopying {

	static alloc(): MTLBufferLayoutDescriptor; // inherited from NSObject

	static new(): MTLBufferLayoutDescriptor; // inherited from NSObject

	stepFunction: MTLStepFunction;

	stepRate: number;

	stride: number;

	copyWithZone(zone: interop.Pointer | interop.Reference<any>): any;
}

declare class MTLBufferLayoutDescriptorArray extends NSObject {

	static alloc(): MTLBufferLayoutDescriptorArray; // inherited from NSObject

	static new(): MTLBufferLayoutDescriptorArray; // inherited from NSObject
	[index: number]: MTLBufferLayoutDescriptor;

	objectAtIndexedSubscript(index: number): MTLBufferLayoutDescriptor;

	setObjectAtIndexedSubscript(bufferDesc: MTLBufferLayoutDescriptor, index: number): void;
}

declare const enum MTLCPUCacheMode {

	DefaultCache = 0,

	WriteCombined = 1
}

interface MTLClearColor {
	red: number;
	green: number;
	blue: number;
	alpha: number;
}
declare var MTLClearColor: interop.StructType<MTLClearColor>;

declare function MTLClearColorMake(red: number, green: number, blue: number, alpha: number): MTLClearColor;

declare const enum MTLColorWriteMask {

	None = 0,

	Red = 8,

	Green = 4,

	Blue = 2,

	Alpha = 1,

	All = 15
}

interface MTLCommandBuffer extends NSObjectProtocol {

	commandQueue: MTLCommandQueue;

	device: MTLDevice;

	error: NSError;

	label: string;

	retainedReferences: boolean;

	status: MTLCommandBufferStatus;

	addCompletedHandler(block: (p1: MTLCommandBuffer) => void): void;

	addScheduledHandler(block: (p1: MTLCommandBuffer) => void): void;

	blitCommandEncoder(): MTLBlitCommandEncoder;

	commit(): void;

	computeCommandEncoder(): MTLComputeCommandEncoder;

	enqueue(): void;

	parallelRenderCommandEncoderWithDescriptor(renderPassDescriptor: MTLRenderPassDescriptor): MTLParallelRenderCommandEncoder;

	presentDrawable(drawable: MTLDrawable): void;

	presentDrawableAtTime(drawable: MTLDrawable, presentationTime: number): void;

	renderCommandEncoderWithDescriptor(renderPassDescriptor: MTLRenderPassDescriptor): MTLRenderCommandEncoder;

	waitUntilCompleted(): void;

	waitUntilScheduled(): void;
}
declare var MTLCommandBuffer: {

	prototype: MTLCommandBuffer;
};

declare const enum MTLCommandBufferError {

	None = 0,

	Internal = 1,

	Timeout = 2,

	PageFault = 3,

	Blacklisted = 4,

	NotPermitted = 7,

	OutOfMemory = 8,

	InvalidResource = 9,

	Memoryless = 10
}

declare var MTLCommandBufferErrorDomain: string;

declare const enum MTLCommandBufferStatus {

	NotEnqueued = 0,

	Enqueued = 1,

	Committed = 2,

	Scheduled = 3,

	Completed = 4,

	Error = 5
}

interface MTLCommandEncoder extends NSObjectProtocol {

	device: MTLDevice;

	label: string;

	endEncoding(): void;

	insertDebugSignpost(string: string): void;

	popDebugGroup(): void;

	pushDebugGroup(string: string): void;
}
declare var MTLCommandEncoder: {

	prototype: MTLCommandEncoder;
};

interface MTLCommandQueue extends NSObjectProtocol {

	device: MTLDevice;

	label: string;

	commandBuffer(): MTLCommandBuffer;

	commandBufferWithUnretainedReferences(): MTLCommandBuffer;

	insertDebugCaptureBoundary(): void;
}
declare var MTLCommandQueue: {

	prototype: MTLCommandQueue;
};

declare const enum MTLCompareFunction {

	Never = 0,

	Less = 1,

	Equal = 2,

	LessEqual = 3,

	Greater = 4,

	NotEqual = 5,

	GreaterEqual = 6,

	Always = 7
}

declare class MTLCompileOptions extends NSObject implements NSCopying {

	static alloc(): MTLCompileOptions; // inherited from NSObject

	static new(): MTLCompileOptions; // inherited from NSObject

	fastMathEnabled: boolean;

	languageVersion: MTLLanguageVersion;

	preprocessorMacros: NSDictionary<string, NSObject>;

	copyWithZone(zone: interop.Pointer | interop.Reference<any>): any;
}

interface MTLComputeCommandEncoder extends MTLCommandEncoder {

	dispatchThreadgroupsThreadsPerThreadgroup(threadgroupsPerGrid: MTLSize, threadsPerThreadgroup: MTLSize): void;

	dispatchThreadgroupsWithIndirectBufferIndirectBufferOffsetThreadsPerThreadgroup(indirectBuffer: MTLBuffer, indirectBufferOffset: number, threadsPerThreadgroup: MTLSize): void;

	setBufferOffsetAtIndex(buffer: MTLBuffer, offset: number, index: number): void;

	setBufferOffsetAtIndex(offset: number, index: number): void;

	setBuffersOffsetsWithRange(buffers: interop.Reference<MTLBuffer>, offsets: interop.Reference<number>, range: NSRange): void;

	setBytesLengthAtIndex(bytes: interop.Pointer | interop.Reference<any>, length: number, index: number): void;

	setComputePipelineState(state: MTLComputePipelineState): void;

	setSamplerStateAtIndex(sampler: MTLSamplerState, index: number): void;

	setSamplerStateLodMinClampLodMaxClampAtIndex(sampler: MTLSamplerState, lodMinClamp: number, lodMaxClamp: number, index: number): void;

	setSamplerStatesLodMinClampsLodMaxClampsWithRange(samplers: interop.Reference<MTLSamplerState>, lodMinClamps: interop.Reference<number>, lodMaxClamps: interop.Reference<number>, range: NSRange): void;

	setSamplerStatesWithRange(samplers: interop.Reference<MTLSamplerState>, range: NSRange): void;

	setStageInRegion(region: MTLRegion): void;

	setTextureAtIndex(texture: MTLTexture, index: number): void;

	setTexturesWithRange(textures: interop.Reference<MTLTexture>, range: NSRange): void;

	setThreadgroupMemoryLengthAtIndex(length: number, index: number): void;

	updateFence(fence: MTLFence): void;

	waitForFence(fence: MTLFence): void;
}
declare var MTLComputeCommandEncoder: {

	prototype: MTLComputeCommandEncoder;
};

declare class MTLComputePipelineDescriptor extends NSObject implements NSCopying {

	static alloc(): MTLComputePipelineDescriptor; // inherited from NSObject

	static new(): MTLComputePipelineDescriptor; // inherited from NSObject

	computeFunction: MTLFunction;

	label: string;

	stageInputDescriptor: MTLStageInputOutputDescriptor;

	threadGroupSizeIsMultipleOfThreadExecutionWidth: boolean;

	copyWithZone(zone: interop.Pointer | interop.Reference<any>): any;

	reset(): void;
}

declare class MTLComputePipelineReflection extends NSObject {

	static alloc(): MTLComputePipelineReflection; // inherited from NSObject

	static new(): MTLComputePipelineReflection; // inherited from NSObject

	/* readonly */ arguments: NSArray<MTLArgument>;
}

interface MTLComputePipelineState extends NSObjectProtocol {

	device: MTLDevice;

	maxTotalThreadsPerThreadgroup: number;

	threadExecutionWidth: number;
}
declare var MTLComputePipelineState: {

	prototype: MTLComputePipelineState;
};

declare function MTLCreateSystemDefaultDevice(): MTLDevice;

declare const enum MTLCullMode {

	None = 0,

	Front = 1,

	Back = 2
}

declare const enum MTLDataType {

	None = 0,

	Struct = 1,

	Array = 2,

	Float = 3,

	Float2 = 4,

	Float3 = 5,

	Float4 = 6,

	Float2x2 = 7,

	Float2x3 = 8,

	Float2x4 = 9,

	Float3x2 = 10,

	Float3x3 = 11,

	Float3x4 = 12,

	Float4x2 = 13,

	Float4x3 = 14,

	Float4x4 = 15,

	Half = 16,

	Half2 = 17,

	Half3 = 18,

	Half4 = 19,

	Half2x2 = 20,

	Half2x3 = 21,

	Half2x4 = 22,

	Half3x2 = 23,

	Half3x3 = 24,

	Half3x4 = 25,

	Half4x2 = 26,

	Half4x3 = 27,

	Half4x4 = 28,

	Int = 29,

	Int2 = 30,

	Int3 = 31,

	Int4 = 32,

	UInt = 33,

	UInt2 = 34,

	UInt3 = 35,

	UInt4 = 36,

	Short = 37,

	Short2 = 38,

	Short3 = 39,

	Short4 = 40,

	UShort = 41,

	UShort2 = 42,

	UShort3 = 43,

	UShort4 = 44,

	Char = 45,

	Char2 = 46,

	Char3 = 47,

	Char4 = 48,

	UChar = 49,

	UChar2 = 50,

	UChar3 = 51,

	UChar4 = 52,

	Bool = 53,

	Bool2 = 54,

	Bool3 = 55,

	Bool4 = 56
}

declare const enum MTLDepthClipMode {

	Clip = 0,

	Clamp = 1
}

declare class MTLDepthStencilDescriptor extends NSObject implements NSCopying {

	static alloc(): MTLDepthStencilDescriptor; // inherited from NSObject

	static new(): MTLDepthStencilDescriptor; // inherited from NSObject

	backFaceStencil: MTLStencilDescriptor;

	depthCompareFunction: MTLCompareFunction;

	depthWriteEnabled: boolean;

	frontFaceStencil: MTLStencilDescriptor;

	label: string;

	copyWithZone(zone: interop.Pointer | interop.Reference<any>): any;
}

interface MTLDepthStencilState extends NSObjectProtocol {

	device: MTLDevice;

	label: string;
}
declare var MTLDepthStencilState: {

	prototype: MTLDepthStencilState;
};

interface MTLDevice extends NSObjectProtocol {

	maxThreadsPerThreadgroup: MTLSize;

	name: string;

	heapBufferSizeAndAlignWithLengthOptions(length: number, options: MTLResourceOptions): MTLSizeAndAlign;

	heapTextureSizeAndAlignWithDescriptor(desc: MTLTextureDescriptor): MTLSizeAndAlign;

	newBufferWithBytesLengthOptions(pointer: interop.Pointer | interop.Reference<any>, length: number, options: MTLResourceOptions): MTLBuffer;

	newBufferWithBytesNoCopyLengthOptionsDeallocator(pointer: interop.Pointer | interop.Reference<any>, length: number, options: MTLResourceOptions, deallocator: (p1: interop.Pointer | interop.Reference<any>, p2: number) => void): MTLBuffer;

	newBufferWithLengthOptions(length: number, options: MTLResourceOptions): MTLBuffer;

	newCommandQueue(): MTLCommandQueue;

	newCommandQueueWithMaxCommandBufferCount(maxCommandBufferCount: number): MTLCommandQueue;

	newComputePipelineStateWithDescriptorOptionsCompletionHandler(descriptor: MTLComputePipelineDescriptor, options: MTLPipelineOption, completionHandler: (p1: MTLComputePipelineState, p2: MTLComputePipelineReflection, p3: NSError) => void): void;

	newComputePipelineStateWithDescriptorOptionsReflectionError(descriptor: MTLComputePipelineDescriptor, options: MTLPipelineOption, reflection: interop.Pointer | interop.Reference<MTLComputePipelineReflection>): MTLComputePipelineState;

	newComputePipelineStateWithFunctionCompletionHandler(computeFunction: MTLFunction, completionHandler: (p1: MTLComputePipelineState, p2: NSError) => void): void;

	newComputePipelineStateWithFunctionError(computeFunction: MTLFunction): MTLComputePipelineState;

	newComputePipelineStateWithFunctionOptionsCompletionHandler(computeFunction: MTLFunction, options: MTLPipelineOption, completionHandler: (p1: MTLComputePipelineState, p2: MTLComputePipelineReflection, p3: NSError) => void): void;

	newComputePipelineStateWithFunctionOptionsReflectionError(computeFunction: MTLFunction, options: MTLPipelineOption, reflection: interop.Pointer | interop.Reference<MTLComputePipelineReflection>): MTLComputePipelineState;

	newDefaultLibrary(): MTLLibrary;

	newDefaultLibraryWithBundleError(bundle: NSBundle): MTLLibrary;

	newDepthStencilStateWithDescriptor(descriptor: MTLDepthStencilDescriptor): MTLDepthStencilState;

	newFence(): MTLFence;

	newHeapWithDescriptor(descriptor: MTLHeapDescriptor): MTLHeap;

	newLibraryWithDataError(data: NSObject): MTLLibrary;

	newLibraryWithFileError(filepath: string): MTLLibrary;

	newLibraryWithSourceOptionsCompletionHandler(source: string, options: MTLCompileOptions, completionHandler: (p1: MTLLibrary, p2: NSError) => void): void;

	newLibraryWithSourceOptionsError(source: string, options: MTLCompileOptions): MTLLibrary;

	newRenderPipelineStateWithDescriptorCompletionHandler(descriptor: MTLRenderPipelineDescriptor, completionHandler: (p1: MTLRenderPipelineState, p2: NSError) => void): void;

	newRenderPipelineStateWithDescriptorError(descriptor: MTLRenderPipelineDescriptor): MTLRenderPipelineState;

	newRenderPipelineStateWithDescriptorOptionsCompletionHandler(descriptor: MTLRenderPipelineDescriptor, options: MTLPipelineOption, completionHandler: (p1: MTLRenderPipelineState, p2: MTLRenderPipelineReflection, p3: NSError) => void): void;

	newRenderPipelineStateWithDescriptorOptionsReflectionError(descriptor: MTLRenderPipelineDescriptor, options: MTLPipelineOption, reflection: interop.Pointer | interop.Reference<MTLRenderPipelineReflection>): MTLRenderPipelineState;

	newSamplerStateWithDescriptor(descriptor: MTLSamplerDescriptor): MTLSamplerState;

	newTextureWithDescriptor(descriptor: MTLTextureDescriptor): MTLTexture;

	supportsFeatureSet(featureSet: MTLFeatureSet): boolean;

	supportsTextureSampleCount(sampleCount: number): boolean;
}
declare var MTLDevice: {

	prototype: MTLDevice;
};

interface MTLDispatchThreadgroupsIndirectArguments {
	threadgroupsPerGrid: interop.Reference<number>;
}
declare var MTLDispatchThreadgroupsIndirectArguments: interop.StructType<MTLDispatchThreadgroupsIndirectArguments>;

interface MTLDrawIndexedPrimitivesIndirectArguments {
	indexCount: number;
	instanceCount: number;
	indexStart: number;
	baseVertex: number;
	baseInstance: number;
}
declare var MTLDrawIndexedPrimitivesIndirectArguments: interop.StructType<MTLDrawIndexedPrimitivesIndirectArguments>;

interface MTLDrawPatchIndirectArguments {
	patchCount: number;
	instanceCount: number;
	patchStart: number;
	baseInstance: number;
}
declare var MTLDrawPatchIndirectArguments: interop.StructType<MTLDrawPatchIndirectArguments>;

interface MTLDrawPrimitivesIndirectArguments {
	vertexCount: number;
	instanceCount: number;
	vertexStart: number;
	baseInstance: number;
}
declare var MTLDrawPrimitivesIndirectArguments: interop.StructType<MTLDrawPrimitivesIndirectArguments>;

interface MTLDrawable extends NSObjectProtocol {

	present(): void;

	presentAtTime(presentationTime: number): void;
}
declare var MTLDrawable: {

	prototype: MTLDrawable;
};

declare const enum MTLFeatureSet {

	iOS_GPUFamily1_v1 = 0,

	iOS_GPUFamily2_v1 = 1,

	iOS_GPUFamily1_v2 = 2,

	iOS_GPUFamily2_v2 = 3,

	iOS_GPUFamily3_v1 = 4,

	iOS_GPUFamily1_v3 = 5,

	iOS_GPUFamily2_v3 = 6,

	iOS_GPUFamily3_v2 = 7,

	OSX_GPUFamily1_v1 = 10000,

	OSX_GPUFamily1_v2 = 10001,

	OSX_ReadWriteTextureTier2 = 10002,

	tvOS_GPUFamily1_v1 = 30000,

	tvOS_GPUFamily1_v2 = 30001
}

interface MTLFence extends NSObjectProtocol {

	device: MTLDevice;

	label: string;
}
declare var MTLFence: {

	prototype: MTLFence;
};

interface MTLFunction extends NSObjectProtocol {

	device: MTLDevice;

	functionConstantsDictionary: NSDictionary<string, MTLFunctionConstant>;

	functionType: MTLFunctionType;

	label: string;

	name: string;

	patchControlPointCount: number;

	patchType: MTLPatchType;

	stageInputAttributes: NSArray<MTLAttribute>;

	vertexAttributes: NSArray<MTLVertexAttribute>;
}
declare var MTLFunction: {

	prototype: MTLFunction;
};

declare class MTLFunctionConstant extends NSObject {

	static alloc(): MTLFunctionConstant; // inherited from NSObject

	static new(): MTLFunctionConstant; // inherited from NSObject

	/* readonly */ index: number;

	/* readonly */ name: string;

	/* readonly */ required: boolean;

	/* readonly */ type: MTLDataType;
}

declare class MTLFunctionConstantValues extends NSObject implements NSCopying {

	static alloc(): MTLFunctionConstantValues; // inherited from NSObject

	static new(): MTLFunctionConstantValues; // inherited from NSObject

	copyWithZone(zone: interop.Pointer | interop.Reference<any>): any;

	reset(): void;

	setConstantValueTypeAtIndex(value: interop.Pointer | interop.Reference<any>, type: MTLDataType, index: number): void;

	setConstantValueTypeWithName(value: interop.Pointer | interop.Reference<any>, type: MTLDataType, name: string): void;

	setConstantValuesTypeWithRange(values: interop.Pointer | interop.Reference<any>, type: MTLDataType, range: NSRange): void;
}

declare const enum MTLFunctionType {

	Vertex = 1,

	Fragment = 2,

	Kernel = 3
}

interface MTLHeap extends NSObjectProtocol {

	cpuCacheMode: MTLCPUCacheMode;

	device: MTLDevice;

	label: string;

	size: number;

	storageMode: MTLStorageMode;

	usedSize: number;

	maxAvailableSizeWithAlignment(alignment: number): number;

	newBufferWithLengthOptions(length: number, options: MTLResourceOptions): MTLBuffer;

	newTextureWithDescriptor(desc: MTLTextureDescriptor): MTLTexture;

	setPurgeableState(state: MTLPurgeableState): MTLPurgeableState;
}
declare var MTLHeap: {

	prototype: MTLHeap;
};

declare class MTLHeapDescriptor extends NSObject implements NSCopying {

	static alloc(): MTLHeapDescriptor; // inherited from NSObject

	static new(): MTLHeapDescriptor; // inherited from NSObject

	cpuCacheMode: MTLCPUCacheMode;

	size: number;

	storageMode: MTLStorageMode;

	copyWithZone(zone: interop.Pointer | interop.Reference<any>): any;
}

declare const enum MTLIndexType {

	UInt16 = 0,

	UInt32 = 1
}

declare const enum MTLLanguageVersion {

	Version1_0 = 65536,

	Version1_1 = 65537,

	Version1_2 = 65538
}

interface MTLLibrary extends NSObjectProtocol {

	device: MTLDevice;

	functionNames: NSArray<string>;

	label: string;

	newFunctionWithName(functionName: string): MTLFunction;

	newFunctionWithNameConstantValuesCompletionHandler(name: string, constantValues: MTLFunctionConstantValues, completionHandler: (p1: MTLFunction, p2: NSError) => void): void;

	newFunctionWithNameConstantValuesError(name: string, constantValues: MTLFunctionConstantValues): MTLFunction;
}
declare var MTLLibrary: {

	prototype: MTLLibrary;
};

declare const enum MTLLibraryError {

	Unsupported = 1,

	Internal = 2,

	CompileFailure = 3,

	CompileWarning = 4,

	FunctionNotFound = 5,

	FileNotFound = 6
}

declare var MTLLibraryErrorDomain: string;

declare const enum MTLLoadAction {

	DontCare = 0,

	Load = 1,

	Clear = 2
}

declare const enum MTLMultisampleDepthResolveFilter {

	Sample0 = 0,

	Min = 1,

	Max = 2
}

interface MTLOrigin {
	x: number;
	y: number;
	z: number;
}
declare var MTLOrigin: interop.StructType<MTLOrigin>;

interface MTLParallelRenderCommandEncoder extends MTLCommandEncoder {

	renderCommandEncoder(): MTLRenderCommandEncoder;

	setColorStoreActionAtIndex(storeAction: MTLStoreAction, colorAttachmentIndex: number): void;

	setDepthStoreAction(storeAction: MTLStoreAction): void;

	setStencilStoreAction(storeAction: MTLStoreAction): void;
}
declare var MTLParallelRenderCommandEncoder: {

	prototype: MTLParallelRenderCommandEncoder;
};

declare const enum MTLPatchType {

	None = 0,

	Triangle = 1,

	Quad = 2
}

declare const enum MTLPipelineOption {

	None = 0,

	ArgumentInfo = 1,

	BufferTypeInfo = 2
}

declare const enum MTLPixelFormat {

	Invalid = 0,

	A8Unorm = 1,

	R8Unorm = 10,

	R8Unorm_sRGB = 11,

	R8Snorm = 12,

	R8Uint = 13,

	R8Sint = 14,

	R16Unorm = 20,

	R16Snorm = 22,

	R16Uint = 23,

	R16Sint = 24,

	R16Float = 25,

	RG8Unorm = 30,

	RG8Unorm_sRGB = 31,

	RG8Snorm = 32,

	RG8Uint = 33,

	RG8Sint = 34,

	B5G6R5Unorm = 40,

	A1BGR5Unorm = 41,

	ABGR4Unorm = 42,

	BGR5A1Unorm = 43,

	R32Uint = 53,

	R32Sint = 54,

	R32Float = 55,

	RG16Unorm = 60,

	RG16Snorm = 62,

	RG16Uint = 63,

	RG16Sint = 64,

	RG16Float = 65,

	RGBA8Unorm = 70,

	RGBA8Unorm_sRGB = 71,

	RGBA8Snorm = 72,

	RGBA8Uint = 73,

	RGBA8Sint = 74,

	BGRA8Unorm = 80,

	BGRA8Unorm_sRGB = 81,

	RGB10A2Unorm = 90,

	RGB10A2Uint = 91,

	RG11B10Float = 92,

	RGB9E5Float = 93,

	BGR10_XR = 554,

	BGR10_XR_sRGB = 555,

	RG32Uint = 103,

	RG32Sint = 104,

	RG32Float = 105,

	RGBA16Unorm = 110,

	RGBA16Snorm = 112,

	RGBA16Uint = 113,

	RGBA16Sint = 114,

	RGBA16Float = 115,

	BGRA10_XR = 552,

	BGRA10_XR_sRGB = 553,

	RGBA32Uint = 123,

	RGBA32Sint = 124,

	RGBA32Float = 125,

	BC1_RGBA = 130,

	BC1_RGBA_sRGB = 131,

	BC2_RGBA = 132,

	BC2_RGBA_sRGB = 133,

	BC3_RGBA = 134,

	BC3_RGBA_sRGB = 135,

	BC4_RUnorm = 140,

	BC4_RSnorm = 141,

	BC5_RGUnorm = 142,

	BC5_RGSnorm = 143,

	BC6H_RGBFloat = 150,

	BC6H_RGBUfloat = 151,

	BC7_RGBAUnorm = 152,

	BC7_RGBAUnorm_sRGB = 153,

	PVRTC_RGB_2BPP = 160,

	PVRTC_RGB_2BPP_sRGB = 161,

	PVRTC_RGB_4BPP = 162,

	PVRTC_RGB_4BPP_sRGB = 163,

	PVRTC_RGBA_2BPP = 164,

	PVRTC_RGBA_2BPP_sRGB = 165,

	PVRTC_RGBA_4BPP = 166,

	PVRTC_RGBA_4BPP_sRGB = 167,

	EAC_R11Unorm = 170,

	EAC_R11Snorm = 172,

	EAC_RG11Unorm = 174,

	EAC_RG11Snorm = 176,

	EAC_RGBA8 = 178,

	EAC_RGBA8_sRGB = 179,

	ETC2_RGB8 = 180,

	ETC2_RGB8_sRGB = 181,

	ETC2_RGB8A1 = 182,

	ETC2_RGB8A1_sRGB = 183,

	ASTC_4x4_sRGB = 186,

	ASTC_5x4_sRGB = 187,

	ASTC_5x5_sRGB = 188,

	ASTC_6x5_sRGB = 189,

	ASTC_6x6_sRGB = 190,

	ASTC_8x5_sRGB = 192,

	ASTC_8x6_sRGB = 193,

	ASTC_8x8_sRGB = 194,

	ASTC_10x5_sRGB = 195,

	ASTC_10x6_sRGB = 196,

	ASTC_10x8_sRGB = 197,

	ASTC_10x10_sRGB = 198,

	ASTC_12x10_sRGB = 199,

	ASTC_12x12_sRGB = 200,

	ASTC_4x4_LDR = 204,

	ASTC_5x4_LDR = 205,

	ASTC_5x5_LDR = 206,

	ASTC_6x5_LDR = 207,

	ASTC_6x6_LDR = 208,

	ASTC_8x5_LDR = 210,

	ASTC_8x6_LDR = 211,

	ASTC_8x8_LDR = 212,

	ASTC_10x5_LDR = 213,

	ASTC_10x6_LDR = 214,

	ASTC_10x8_LDR = 215,

	ASTC_10x10_LDR = 216,

	ASTC_12x10_LDR = 217,

	ASTC_12x12_LDR = 218,

	GBGR422 = 240,

	BGRG422 = 241,

	Depth32Float = 252,

	Stencil8 = 253,

	Depth24Unorm_Stencil8 = 255,

	Depth32Float_Stencil8 = 260,

	X32_Stencil8 = 261,

	X24_Stencil8 = 262
}

declare const enum MTLPrimitiveType {

	Point = 0,

	Line = 1,

	LineStrip = 2,

	Triangle = 3,

	TriangleStrip = 4
}

declare const enum MTLPurgeableState {

	KeepCurrent = 1,

	NonVolatile = 2,

	Volatile = 3,

	Empty = 4
}

interface MTLQuadTessellationFactorsHalf {
	edgeTessellationFactor: interop.Reference<number>;
	insideTessellationFactor: interop.Reference<number>;
}
declare var MTLQuadTessellationFactorsHalf: interop.StructType<MTLQuadTessellationFactorsHalf>;

interface MTLRegion {
	origin: MTLOrigin;
	size: MTLSize;
}
declare var MTLRegion: interop.StructType<MTLRegion>;

interface MTLRenderCommandEncoder extends MTLCommandEncoder {

	drawIndexedPatchesPatchStartPatchCountPatchIndexBufferPatchIndexBufferOffsetControlPointIndexBufferControlPointIndexBufferOffsetInstanceCountBaseInstance(numberOfPatchControlPoints: number, patchStart: number, patchCount: number, patchIndexBuffer: MTLBuffer, patchIndexBufferOffset: number, controlPointIndexBuffer: MTLBuffer, controlPointIndexBufferOffset: number, instanceCount: number, baseInstance: number): void;

	drawIndexedPrimitivesIndexCountIndexTypeIndexBufferIndexBufferOffset(primitiveType: MTLPrimitiveType, indexCount: number, indexType: MTLIndexType, indexBuffer: MTLBuffer, indexBufferOffset: number): void;

	drawIndexedPrimitivesIndexCountIndexTypeIndexBufferIndexBufferOffsetInstanceCount(primitiveType: MTLPrimitiveType, indexCount: number, indexType: MTLIndexType, indexBuffer: MTLBuffer, indexBufferOffset: number, instanceCount: number): void;

	drawIndexedPrimitivesIndexCountIndexTypeIndexBufferIndexBufferOffsetInstanceCountBaseVertexBaseInstance(primitiveType: MTLPrimitiveType, indexCount: number, indexType: MTLIndexType, indexBuffer: MTLBuffer, indexBufferOffset: number, instanceCount: number, baseVertex: number, baseInstance: number): void;

	drawIndexedPrimitivesIndexTypeIndexBufferIndexBufferOffsetIndirectBufferIndirectBufferOffset(primitiveType: MTLPrimitiveType, indexType: MTLIndexType, indexBuffer: MTLBuffer, indexBufferOffset: number, indirectBuffer: MTLBuffer, indirectBufferOffset: number): void;

	drawPatchesPatchStartPatchCountPatchIndexBufferPatchIndexBufferOffsetInstanceCountBaseInstance(numberOfPatchControlPoints: number, patchStart: number, patchCount: number, patchIndexBuffer: MTLBuffer, patchIndexBufferOffset: number, instanceCount: number, baseInstance: number): void;

	drawPrimitivesIndirectBufferIndirectBufferOffset(primitiveType: MTLPrimitiveType, indirectBuffer: MTLBuffer, indirectBufferOffset: number): void;

	drawPrimitivesVertexStartVertexCount(primitiveType: MTLPrimitiveType, vertexStart: number, vertexCount: number): void;

	drawPrimitivesVertexStartVertexCountInstanceCount(primitiveType: MTLPrimitiveType, vertexStart: number, vertexCount: number, instanceCount: number): void;

	drawPrimitivesVertexStartVertexCountInstanceCountBaseInstance(primitiveType: MTLPrimitiveType, vertexStart: number, vertexCount: number, instanceCount: number, baseInstance: number): void;

	setBlendColorRedGreenBlueAlpha(red: number, green: number, blue: number, alpha: number): void;

	setColorStoreActionAtIndex(storeAction: MTLStoreAction, colorAttachmentIndex: number): void;

	setCullMode(cullMode: MTLCullMode): void;

	setDepthBiasSlopeScaleClamp(depthBias: number, slopeScale: number, clamp: number): void;

	setDepthStencilState(depthStencilState: MTLDepthStencilState): void;

	setDepthStoreAction(storeAction: MTLStoreAction): void;

	setFragmentBufferOffsetAtIndex(buffer: MTLBuffer, offset: number, index: number): void;

	setFragmentBufferOffsetAtIndex(offset: number, index: number): void;

	setFragmentBuffersOffsetsWithRange(buffers: interop.Reference<MTLBuffer>, offset: interop.Reference<number>, range: NSRange): void;

	setFragmentBytesLengthAtIndex(bytes: interop.Pointer | interop.Reference<any>, length: number, index: number): void;

	setFragmentSamplerStateAtIndex(sampler: MTLSamplerState, index: number): void;

	setFragmentSamplerStateLodMinClampLodMaxClampAtIndex(sampler: MTLSamplerState, lodMinClamp: number, lodMaxClamp: number, index: number): void;

	setFragmentSamplerStatesLodMinClampsLodMaxClampsWithRange(samplers: interop.Reference<MTLSamplerState>, lodMinClamps: interop.Reference<number>, lodMaxClamps: interop.Reference<number>, range: NSRange): void;

	setFragmentSamplerStatesWithRange(samplers: interop.Reference<MTLSamplerState>, range: NSRange): void;

	setFragmentTextureAtIndex(texture: MTLTexture, index: number): void;

	setFragmentTexturesWithRange(textures: interop.Reference<MTLTexture>, range: NSRange): void;

	setFrontFacingWinding(frontFacingWinding: MTLWinding): void;

	setRenderPipelineState(pipelineState: MTLRenderPipelineState): void;

	setScissorRect(rect: MTLScissorRect): void;

	setStencilFrontReferenceValueBackReferenceValue(frontReferenceValue: number, backReferenceValue: number): void;

	setStencilReferenceValue(referenceValue: number): void;

	setStencilStoreAction(storeAction: MTLStoreAction): void;

	setTessellationFactorBufferOffsetInstanceStride(buffer: MTLBuffer, offset: number, instanceStride: number): void;

	setTessellationFactorScale(scale: number): void;

	setTriangleFillMode(fillMode: MTLTriangleFillMode): void;

	setVertexBufferOffsetAtIndex(offset: number, index: number): void;

	setVertexBufferOffsetAtIndex(buffer: MTLBuffer, offset: number, index: number): void;

	setVertexBuffersOffsetsWithRange(buffers: interop.Reference<MTLBuffer>, offsets: interop.Reference<number>, range: NSRange): void;

	setVertexBytesLengthAtIndex(bytes: interop.Pointer | interop.Reference<any>, length: number, index: number): void;

	setVertexSamplerStateAtIndex(sampler: MTLSamplerState, index: number): void;

	setVertexSamplerStateLodMinClampLodMaxClampAtIndex(sampler: MTLSamplerState, lodMinClamp: number, lodMaxClamp: number, index: number): void;

	setVertexSamplerStatesLodMinClampsLodMaxClampsWithRange(samplers: interop.Reference<MTLSamplerState>, lodMinClamps: interop.Reference<number>, lodMaxClamps: interop.Reference<number>, range: NSRange): void;

	setVertexSamplerStatesWithRange(samplers: interop.Reference<MTLSamplerState>, range: NSRange): void;

	setVertexTextureAtIndex(texture: MTLTexture, index: number): void;

	setVertexTexturesWithRange(textures: interop.Reference<MTLTexture>, range: NSRange): void;

	setViewport(viewport: MTLViewport): void;

	setVisibilityResultModeOffset(mode: MTLVisibilityResultMode, offset: number): void;

	updateFenceAfterStages(fence: MTLFence, stages: MTLRenderStages): void;

	waitForFenceBeforeStages(fence: MTLFence, stages: MTLRenderStages): void;
}
declare var MTLRenderCommandEncoder: {

	prototype: MTLRenderCommandEncoder;
};

declare class MTLRenderPassAttachmentDescriptor extends NSObject implements NSCopying {

	static alloc(): MTLRenderPassAttachmentDescriptor; // inherited from NSObject

	static new(): MTLRenderPassAttachmentDescriptor; // inherited from NSObject

	depthPlane: number;

	level: number;

	loadAction: MTLLoadAction;

	resolveDepthPlane: number;

	resolveLevel: number;

	resolveSlice: number;

	resolveTexture: MTLTexture;

	slice: number;

	storeAction: MTLStoreAction;

	texture: MTLTexture;

	copyWithZone(zone: interop.Pointer | interop.Reference<any>): any;
}

declare class MTLRenderPassColorAttachmentDescriptor extends MTLRenderPassAttachmentDescriptor {

	static alloc(): MTLRenderPassColorAttachmentDescriptor; // inherited from NSObject

	static new(): MTLRenderPassColorAttachmentDescriptor; // inherited from NSObject

	clearColor: MTLClearColor;
}

declare class MTLRenderPassColorAttachmentDescriptorArray extends NSObject {

	static alloc(): MTLRenderPassColorAttachmentDescriptorArray; // inherited from NSObject

	static new(): MTLRenderPassColorAttachmentDescriptorArray; // inherited from NSObject
	[index: number]: MTLRenderPassColorAttachmentDescriptor;

	objectAtIndexedSubscript(attachmentIndex: number): MTLRenderPassColorAttachmentDescriptor;

	setObjectAtIndexedSubscript(attachment: MTLRenderPassColorAttachmentDescriptor, attachmentIndex: number): void;
}

declare class MTLRenderPassDepthAttachmentDescriptor extends MTLRenderPassAttachmentDescriptor {

	static alloc(): MTLRenderPassDepthAttachmentDescriptor; // inherited from NSObject

	static new(): MTLRenderPassDepthAttachmentDescriptor; // inherited from NSObject

	clearDepth: number;

	depthResolveFilter: MTLMultisampleDepthResolveFilter;
}

declare class MTLRenderPassDescriptor extends NSObject implements NSCopying {

	static alloc(): MTLRenderPassDescriptor; // inherited from NSObject

	static new(): MTLRenderPassDescriptor; // inherited from NSObject

	static renderPassDescriptor(): MTLRenderPassDescriptor;

	/* readonly */ colorAttachments: MTLRenderPassColorAttachmentDescriptorArray;

	depthAttachment: MTLRenderPassDepthAttachmentDescriptor;

	stencilAttachment: MTLRenderPassStencilAttachmentDescriptor;

	visibilityResultBuffer: MTLBuffer;

	copyWithZone(zone: interop.Pointer | interop.Reference<any>): any;
}

declare class MTLRenderPassStencilAttachmentDescriptor extends MTLRenderPassAttachmentDescriptor {

	static alloc(): MTLRenderPassStencilAttachmentDescriptor; // inherited from NSObject

	static new(): MTLRenderPassStencilAttachmentDescriptor; // inherited from NSObject

	clearStencil: number;
}

declare class MTLRenderPipelineColorAttachmentDescriptor extends NSObject implements NSCopying {

	static alloc(): MTLRenderPipelineColorAttachmentDescriptor; // inherited from NSObject

	static new(): MTLRenderPipelineColorAttachmentDescriptor; // inherited from NSObject

	alphaBlendOperation: MTLBlendOperation;

	blendingEnabled: boolean;

	destinationAlphaBlendFactor: MTLBlendFactor;

	destinationRGBBlendFactor: MTLBlendFactor;

	pixelFormat: MTLPixelFormat;

	rgbBlendOperation: MTLBlendOperation;

	sourceAlphaBlendFactor: MTLBlendFactor;

	sourceRGBBlendFactor: MTLBlendFactor;

	writeMask: MTLColorWriteMask;

	copyWithZone(zone: interop.Pointer | interop.Reference<any>): any;
}

declare class MTLRenderPipelineColorAttachmentDescriptorArray extends NSObject {

	static alloc(): MTLRenderPipelineColorAttachmentDescriptorArray; // inherited from NSObject

	static new(): MTLRenderPipelineColorAttachmentDescriptorArray; // inherited from NSObject
	[index: number]: MTLRenderPipelineColorAttachmentDescriptor;

	objectAtIndexedSubscript(attachmentIndex: number): MTLRenderPipelineColorAttachmentDescriptor;

	setObjectAtIndexedSubscript(attachment: MTLRenderPipelineColorAttachmentDescriptor, attachmentIndex: number): void;
}

declare class MTLRenderPipelineDescriptor extends NSObject implements NSCopying {

	static alloc(): MTLRenderPipelineDescriptor; // inherited from NSObject

	static new(): MTLRenderPipelineDescriptor; // inherited from NSObject

	alphaToCoverageEnabled: boolean;

	alphaToOneEnabled: boolean;

	/* readonly */ colorAttachments: MTLRenderPipelineColorAttachmentDescriptorArray;

	depthAttachmentPixelFormat: MTLPixelFormat;

	fragmentFunction: MTLFunction;

	label: string;

	maxTessellationFactor: number;

	rasterizationEnabled: boolean;

	sampleCount: number;

	stencilAttachmentPixelFormat: MTLPixelFormat;

	tessellationControlPointIndexType: MTLTessellationControlPointIndexType;

	tessellationFactorFormat: MTLTessellationFactorFormat;

	tessellationFactorScaleEnabled: boolean;

	tessellationFactorStepFunction: MTLTessellationFactorStepFunction;

	tessellationOutputWindingOrder: MTLWinding;

	tessellationPartitionMode: MTLTessellationPartitionMode;

	vertexDescriptor: MTLVertexDescriptor;

	vertexFunction: MTLFunction;

	copyWithZone(zone: interop.Pointer | interop.Reference<any>): any;

	reset(): void;
}

declare const enum MTLRenderPipelineError {

	Internal = 1,

	Unsupported = 2,

	InvalidInput = 3
}

declare var MTLRenderPipelineErrorDomain: string;

declare class MTLRenderPipelineReflection extends NSObject {

	static alloc(): MTLRenderPipelineReflection; // inherited from NSObject

	static new(): MTLRenderPipelineReflection; // inherited from NSObject

	/* readonly */ fragmentArguments: NSArray<MTLArgument>;

	/* readonly */ vertexArguments: NSArray<MTLArgument>;
}

interface MTLRenderPipelineState extends NSObjectProtocol {

	device: MTLDevice;

	label: string;
}
declare var MTLRenderPipelineState: {

	prototype: MTLRenderPipelineState;
};

declare const enum MTLRenderStages {

	Vertex = 1,

	Fragment = 2
}

interface MTLResource extends NSObjectProtocol {

	cpuCacheMode: MTLCPUCacheMode;

	device: MTLDevice;

	heap: MTLHeap;

	label: string;

	storageMode: MTLStorageMode;

	isAliasable(): boolean;

	makeAliasable(): void;

	setPurgeableState(state: MTLPurgeableState): MTLPurgeableState;
}
declare var MTLResource: {

	prototype: MTLResource;
};

declare const enum MTLResourceOptions {

	CPUCacheModeDefaultCache = 0,

	CPUCacheModeWriteCombined = 1,

	StorageModeShared = 0,

	StorageModeManaged = 16,

	StorageModePrivate = 32,

	StorageModeMemoryless = 48,

	HazardTrackingModeUntracked = 256,

	OptionCPUCacheModeDefault = 0,

	OptionCPUCacheModeWriteCombined = 1
}

declare const enum MTLSamplerAddressMode {

	ClampToEdge = 0,

	MirrorClampToEdge = 1,

	Repeat = 2,

	MirrorRepeat = 3,

	ClampToZero = 4,

	ClampToBorderColor = 5
}

declare const enum MTLSamplerBorderColor {

	TransparentBlack = 0,

	OpaqueBlack = 1,

	OpaqueWhite = 2
}

declare class MTLSamplerDescriptor extends NSObject implements NSCopying {

	static alloc(): MTLSamplerDescriptor; // inherited from NSObject

	static new(): MTLSamplerDescriptor; // inherited from NSObject

	compareFunction: MTLCompareFunction;

	label: string;

	lodAverage: boolean;

	lodMaxClamp: number;

	lodMinClamp: number;

	magFilter: MTLSamplerMinMagFilter;

	maxAnisotropy: number;

	minFilter: MTLSamplerMinMagFilter;

	mipFilter: MTLSamplerMipFilter;

	normalizedCoordinates: boolean;

	rAddressMode: MTLSamplerAddressMode;

	sAddressMode: MTLSamplerAddressMode;

	tAddressMode: MTLSamplerAddressMode;

	copyWithZone(zone: interop.Pointer | interop.Reference<any>): any;
}

declare const enum MTLSamplerMinMagFilter {

	Nearest = 0,

	Linear = 1
}

declare const enum MTLSamplerMipFilter {

	NotMipmapped = 0,

	Nearest = 1,

	Linear = 2
}

interface MTLSamplerState extends NSObjectProtocol {

	device: MTLDevice;

	label: string;
}
declare var MTLSamplerState: {

	prototype: MTLSamplerState;
};

interface MTLScissorRect {
	x: number;
	y: number;
	width: number;
	height: number;
}
declare var MTLScissorRect: interop.StructType<MTLScissorRect>;

interface MTLSize {
	width: number;
	height: number;
	depth: number;
}
declare var MTLSize: interop.StructType<MTLSize>;

interface MTLSizeAndAlign {
	size: number;
	align: number;
}
declare var MTLSizeAndAlign: interop.StructType<MTLSizeAndAlign>;

declare class MTLStageInputOutputDescriptor extends NSObject implements NSCopying {

	static alloc(): MTLStageInputOutputDescriptor; // inherited from NSObject

	static new(): MTLStageInputOutputDescriptor; // inherited from NSObject

	static stageInputOutputDescriptor(): MTLStageInputOutputDescriptor;

	/* readonly */ attributes: MTLAttributeDescriptorArray;

	indexBufferIndex: number;

	indexType: MTLIndexType;

	/* readonly */ layouts: MTLBufferLayoutDescriptorArray;

	copyWithZone(zone: interop.Pointer | interop.Reference<any>): any;

	reset(): void;
}

declare class MTLStencilDescriptor extends NSObject implements NSCopying {

	static alloc(): MTLStencilDescriptor; // inherited from NSObject

	static new(): MTLStencilDescriptor; // inherited from NSObject

	depthFailureOperation: MTLStencilOperation;

	depthStencilPassOperation: MTLStencilOperation;

	readMask: number;

	stencilCompareFunction: MTLCompareFunction;

	stencilFailureOperation: MTLStencilOperation;

	writeMask: number;

	copyWithZone(zone: interop.Pointer | interop.Reference<any>): any;
}

declare const enum MTLStencilOperation {

	Keep = 0,

	Zero = 1,

	Replace = 2,

	IncrementClamp = 3,

	DecrementClamp = 4,

	Invert = 5,

	IncrementWrap = 6,

	DecrementWrap = 7
}

declare const enum MTLStepFunction {

	Constant = 0,

	PerVertex = 1,

	PerInstance = 2,

	PerPatch = 3,

	PerPatchControlPoint = 4,

	ThreadPositionInGridX = 5,

	ThreadPositionInGridY = 6,

	ThreadPositionInGridXIndexed = 7,

	ThreadPositionInGridYIndexed = 8
}

declare const enum MTLStorageMode {

	Shared = 0,

	Managed = 1,

	Private = 2,

	Memoryless = 3
}

declare const enum MTLStoreAction {

	DontCare = 0,

	Store = 1,

	MultisampleResolve = 2,

	StoreAndMultisampleResolve = 3,

	Unknown = 4
}

declare class MTLStructMember extends NSObject {

	static alloc(): MTLStructMember; // inherited from NSObject

	static new(): MTLStructMember; // inherited from NSObject

	/* readonly */ dataType: MTLDataType;

	/* readonly */ name: string;

	/* readonly */ offset: number;

	arrayType(): MTLArrayType;

	structType(): MTLStructType;
}

declare class MTLStructType extends NSObject {

	static alloc(): MTLStructType; // inherited from NSObject

	static new(): MTLStructType; // inherited from NSObject

	/* readonly */ members: NSArray<MTLStructMember>;

	memberByName(name: string): MTLStructMember;
}

declare const enum MTLTessellationControlPointIndexType {

	None = 0,

	UInt16 = 1,

	UInt32 = 2
}

declare const enum MTLTessellationFactorFormat {

	Half = 0
}

declare const enum MTLTessellationFactorStepFunction {

	Constant = 0,

	PerPatch = 1,

	PerInstance = 2,

	PerPatchAndPerInstance = 3
}

declare const enum MTLTessellationPartitionMode {

	Pow2 = 0,

	Integer = 1,

	FractionalOdd = 2,

	FractionalEven = 3
}

interface MTLTexture extends MTLResource {

	arrayLength: number;

	buffer: MTLBuffer;

	bufferBytesPerRow: number;

	bufferOffset: number;

	depth: number;

	framebufferOnly: boolean;

	height: number;

	mipmapLevelCount: number;

	parentRelativeLevel: number;

	parentRelativeSlice: number;

	parentTexture: MTLTexture;

	pixelFormat: MTLPixelFormat;

	rootResource: MTLResource;

	sampleCount: number;

	textureType: MTLTextureType;

	usage: MTLTextureUsage;

	width: number;

	getBytesBytesPerRowBytesPerImageFromRegionMipmapLevelSlice(pixelBytes: interop.Pointer | interop.Reference<any>, bytesPerRow: number, bytesPerImage: number, region: MTLRegion, level: number, slice: number): void;

	getBytesBytesPerRowFromRegionMipmapLevel(pixelBytes: interop.Pointer | interop.Reference<any>, bytesPerRow: number, region: MTLRegion, level: number): void;

	newTextureViewWithPixelFormat(pixelFormat: MTLPixelFormat): MTLTexture;

	newTextureViewWithPixelFormatTextureTypeLevelsSlices(pixelFormat: MTLPixelFormat, textureType: MTLTextureType, levelRange: NSRange, sliceRange: NSRange): MTLTexture;

	replaceRegionMipmapLevelSliceWithBytesBytesPerRowBytesPerImage(region: MTLRegion, level: number, slice: number, pixelBytes: interop.Pointer | interop.Reference<any>, bytesPerRow: number, bytesPerImage: number): void;

	replaceRegionMipmapLevelWithBytesBytesPerRow(region: MTLRegion, level: number, pixelBytes: interop.Pointer | interop.Reference<any>, bytesPerRow: number): void;
}
declare var MTLTexture: {

	prototype: MTLTexture;
};

declare class MTLTextureDescriptor extends NSObject implements NSCopying {

	static alloc(): MTLTextureDescriptor; // inherited from NSObject

	static new(): MTLTextureDescriptor; // inherited from NSObject

	static texture2DDescriptorWithPixelFormatWidthHeightMipmapped(pixelFormat: MTLPixelFormat, width: number, height: number, mipmapped: boolean): MTLTextureDescriptor;

	static textureCubeDescriptorWithPixelFormatSizeMipmapped(pixelFormat: MTLPixelFormat, size: number, mipmapped: boolean): MTLTextureDescriptor;

	arrayLength: number;

	cpuCacheMode: MTLCPUCacheMode;

	depth: number;

	height: number;

	mipmapLevelCount: number;

	pixelFormat: MTLPixelFormat;

	resourceOptions: MTLResourceOptions;

	sampleCount: number;

	storageMode: MTLStorageMode;

	textureType: MTLTextureType;

	usage: MTLTextureUsage;

	width: number;

	copyWithZone(zone: interop.Pointer | interop.Reference<any>): any;
}

declare const enum MTLTextureType {

	Type1D = 0,

	Type1DArray = 1,

	Type2D = 2,

	Type2DArray = 3,

	Type2DMultisample = 4,

	TypeCube = 5,

	TypeCubeArray = 6,

	Type3D = 7
}

declare const enum MTLTextureUsage {

	Unknown = 0,

	ShaderRead = 1,

	ShaderWrite = 2,

	RenderTarget = 4,

	PixelFormatView = 16
}

declare const enum MTLTriangleFillMode {

	Fill = 0,

	Lines = 1
}

interface MTLTriangleTessellationFactorsHalf {
	edgeTessellationFactor: interop.Reference<number>;
	insideTessellationFactor: number;
}
declare var MTLTriangleTessellationFactorsHalf: interop.StructType<MTLTriangleTessellationFactorsHalf>;

declare class MTLVertexAttribute extends NSObject {

	static alloc(): MTLVertexAttribute; // inherited from NSObject

	static new(): MTLVertexAttribute; // inherited from NSObject

	/* readonly */ active: boolean;

	/* readonly */ attributeIndex: number;

	/* readonly */ attributeType: MTLDataType;

	/* readonly */ name: string;

	/* readonly */ patchControlPointData: boolean;

	/* readonly */ patchData: boolean;
}

declare class MTLVertexAttributeDescriptor extends NSObject implements NSCopying {

	static alloc(): MTLVertexAttributeDescriptor; // inherited from NSObject

	static new(): MTLVertexAttributeDescriptor; // inherited from NSObject

	bufferIndex: number;

	format: MTLVertexFormat;

	offset: number;

	copyWithZone(zone: interop.Pointer | interop.Reference<any>): any;
}

declare class MTLVertexAttributeDescriptorArray extends NSObject {

	static alloc(): MTLVertexAttributeDescriptorArray; // inherited from NSObject

	static new(): MTLVertexAttributeDescriptorArray; // inherited from NSObject
	[index: number]: MTLVertexAttributeDescriptor;

	objectAtIndexedSubscript(index: number): MTLVertexAttributeDescriptor;

	setObjectAtIndexedSubscript(attributeDesc: MTLVertexAttributeDescriptor, index: number): void;
}

declare class MTLVertexBufferLayoutDescriptor extends NSObject implements NSCopying {

	static alloc(): MTLVertexBufferLayoutDescriptor; // inherited from NSObject

	static new(): MTLVertexBufferLayoutDescriptor; // inherited from NSObject

	stepFunction: MTLVertexStepFunction;

	stepRate: number;

	stride: number;

	copyWithZone(zone: interop.Pointer | interop.Reference<any>): any;
}

declare class MTLVertexBufferLayoutDescriptorArray extends NSObject {

	static alloc(): MTLVertexBufferLayoutDescriptorArray; // inherited from NSObject

	static new(): MTLVertexBufferLayoutDescriptorArray; // inherited from NSObject
	[index: number]: MTLVertexBufferLayoutDescriptor;

	objectAtIndexedSubscript(index: number): MTLVertexBufferLayoutDescriptor;

	setObjectAtIndexedSubscript(bufferDesc: MTLVertexBufferLayoutDescriptor, index: number): void;
}

declare class MTLVertexDescriptor extends NSObject implements NSCopying {

	static alloc(): MTLVertexDescriptor; // inherited from NSObject

	static new(): MTLVertexDescriptor; // inherited from NSObject

	static vertexDescriptor(): MTLVertexDescriptor;

	/* readonly */ attributes: MTLVertexAttributeDescriptorArray;

	/* readonly */ layouts: MTLVertexBufferLayoutDescriptorArray;

	copyWithZone(zone: interop.Pointer | interop.Reference<any>): any;

	reset(): void;
}

declare const enum MTLVertexFormat {

	Invalid = 0,

	UChar2 = 1,

	UChar3 = 2,

	UChar4 = 3,

	Char2 = 4,

	Char3 = 5,

	Char4 = 6,

	UChar2Normalized = 7,

	UChar3Normalized = 8,

	UChar4Normalized = 9,

	Char2Normalized = 10,

	Char3Normalized = 11,

	Char4Normalized = 12,

	UShort2 = 13,

	UShort3 = 14,

	UShort4 = 15,

	Short2 = 16,

	Short3 = 17,

	Short4 = 18,

	UShort2Normalized = 19,

	UShort3Normalized = 20,

	UShort4Normalized = 21,

	Short2Normalized = 22,

	Short3Normalized = 23,

	Short4Normalized = 24,

	Half2 = 25,

	Half3 = 26,

	Half4 = 27,

	Float = 28,

	Float2 = 29,

	Float3 = 30,

	Float4 = 31,

	Int = 32,

	Int2 = 33,

	Int3 = 34,

	Int4 = 35,

	UInt = 36,

	UInt2 = 37,

	UInt3 = 38,

	UInt4 = 39,

	Int1010102Normalized = 40,

	UInt1010102Normalized = 41
}

declare const enum MTLVertexStepFunction {

	Constant = 0,

	PerVertex = 1,

	PerInstance = 2,

	PerPatch = 3,

	PerPatchControlPoint = 4
}

interface MTLViewport {
	originX: number;
	originY: number;
	width: number;
	height: number;
	znear: number;
	zfar: number;
}
declare var MTLViewport: interop.StructType<MTLViewport>;

declare const enum MTLVisibilityResultMode {

	Disabled = 0,

	Boolean = 1,

	Counting = 2
}

declare const enum MTLWinding {

	Clockwise = 0,

	CounterClockwise = 1
}
