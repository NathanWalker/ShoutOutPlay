// Temporary definitions for the loading indicator plug-in
declare module 'nativescript-loading-indicator' {
    export type OptionsCommon = any;
    export class LoadingIndicator {
        show(options: OptionsCommon);
        hide();
    }
}
