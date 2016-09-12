import {AuthService} from './services/auth.service';
import {CoachmarksService} from './services/coachmarks.service';
import {FirebaseService} from './services/firebase.service';
import {PlayerService} from './services/player.service';
import {PlaylistService} from './services/playlist.service';
import {SearchService} from './services/search.service';
import {ShoutoutService} from './services/shoutout.service';
import {TrackControlService} from './services/track-controls.service';

export const SHOUTOUTPLAY_PROVIDERS: any[] = [
  AuthService,
  CoachmarksService,
  FirebaseService,
  PlayerService,
  PlaylistService,
  SearchService,
  ShoutoutService,
  TrackControlService
];

// models
export * from './models/playlist.model';
export * from './models/shoutout.model';
export * from './models/track.model';
export * from './models/user.model';

// services
export * from './services/auth.service';
export * from './services/coachmarks.service';
export * from './services/firebase.service';
export * from './services/player.service';
export * from './services/playlist.service';
export * from './services/search.service';
export * from './services/shoutout.service';
export * from './services/track-controls.service';

// components
export * from './components/empty.component';
export * from './components/actionbar.component';