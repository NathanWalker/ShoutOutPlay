import {AuthService} from './services/auth.service';
import {PlayerService} from './services/player.service';
import {PlaylistService} from './services/playlist.service';
import {SearchService} from './services/search.service';
import {ShoutoutService} from './services/shoutout.service';

export const SHOUTOUTPLAY_PROVIDERS: any[] = [
  AuthService,
  PlayerService,
  PlaylistService,
  SearchService,
  ShoutoutService
];

// models
export * from './models/playlist.model';
export * from './models/track.model';

// services
export * from './services/auth.service';
export * from './services/player.service';
export * from './services/playlist.service';
export * from './services/search.service';
export * from './services/shoutout.service';