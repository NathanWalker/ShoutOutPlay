
interface OS_os_log extends NSObjectProtocol {
}
declare var OS_os_log: {

	prototype: OS_os_log;
};

declare var __dso_handle: mach_header;

declare var __dso_handleVar: mach_header;

declare function _os_activity_initiate(dso: interop.Pointer | interop.Reference<any>, description: string, flags: os_activity_flag_t, activity_block: () => void): void;

declare function _os_activity_initiate_f(dso: interop.Pointer | interop.Reference<any>, description: string, flags: os_activity_flag_t, context: interop.Pointer | interop.Reference<any>, _function: interop.FunctionReference<(p1: interop.Pointer | interop.Reference<any>) => void>): void;

declare function _os_activity_label_useraction(dso: interop.Pointer | interop.Reference<any>, name: string): void;

declare function _os_activity_set_breadcrumb(dso: interop.Pointer | interop.Reference<any>, name: string): void;

declare function _os_activity_start(dso: interop.Pointer | interop.Reference<any>, description: string, flags: os_activity_flag_t): number;

declare function _os_log_create(dso: interop.Pointer | interop.Reference<any>, subsystem: string, category: string): NSObject;

declare var _os_log_debug: void;

declare var _os_log_default: void;

declare var _os_log_error: void;

declare var _os_log_fault: void;

declare function _os_log_impl(dso: interop.Pointer | interop.Reference<any>, log: NSObject, type: os_log_type_t, format: string, buf: string, size: number): void;

declare var _os_log_release: void;

declare function os_activity_end(activity: number): void;

declare const enum os_activity_flag_t {

	OS_ACTIVITY_FLAG_DEFAULT = 0,

	OS_ACTIVITY_FLAG_DETACHED = 1,

	OS_ACTIVITY_FLAG_IF_NONE_PRESENT = 2
}

declare function os_activity_get_active(entries: interop.Pointer | interop.Reference<number>, count: interop.Pointer | interop.Reference<number>): number;

declare function os_activity_get_identifier(activity: number, parent_id: interop.Pointer | interop.Reference<number>): number;

interface os_activity_scope_state_s {
	opaque: interop.Reference<number>;
}
declare var os_activity_scope_state_s: interop.StructType<os_activity_scope_state_s>;

declare function os_log_create(subsystem: string, category: string): NSObject;

declare function os_log_is_debug_enabled(log: NSObject): number;

declare function os_log_is_enabled(log: NSObject): number;

declare function os_log_type_enabled(oslog: NSObject, type: os_log_type_t): number;

declare const enum os_log_type_t {

	OS_LOG_TYPE_DEFAULT = 0,

	OS_LOG_TYPE_INFO = 1,

	OS_LOG_TYPE_DEBUG = 2,

	OS_LOG_TYPE_ERROR = 16,

	OS_LOG_TYPE_FAULT = 17
}
