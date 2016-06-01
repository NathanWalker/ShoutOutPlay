// Temporary definitions for the spotify plug-in
declare module 'nativescript-spotify' {
    import {Observable} from 'data/observable';

    export var Utils: any;
    export var TNSSpotifyAuth: any;
    export var TNSSpotifySearch: any;
    export var TNSSpotifyConstants: any;

    export interface TNSTrack {
        id: string;
        name: string;
        artist: any;
        duration: number;
        playableUri: string;
        previewUrl: string;
        album: any;
    }

    export class TNSSpotifyPlayer {
        auth: any;

        initPlayer(emitEvents?: boolean);
        togglePlay(track?: string): Promise<any>
        events: Observable;
    }
}

