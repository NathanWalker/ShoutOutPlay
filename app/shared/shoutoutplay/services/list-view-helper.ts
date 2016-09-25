import {PlaylistModel} from '../models/playlist.model';
import {SharedModel} from '../models/shared.model';
import {SOPUtils} from './sop-utils';

interface IListViewState {
  playlists: Array<PlaylistModel>;
  sharedlist: Array<SharedModel>;
}

export interface IListViewResult {
  ready: boolean;
  playing?: boolean;
  trackId?: string;
  activeShoutOutPath?: string;
  state?: IListViewState;
  msg?: string;
}

/**
 * List view helper to aid in state updates throughout all list views
 */
export class ListViewHelper {

  public static update(state: any, trackId: any, activeList: string, activeShoutOutPath?: string, playlistId?: string): IListViewResult {
    switch (activeList) {
      case 'playlists':
        return ListViewHelper.updatePlaylists(trackId, state, activeShoutOutPath, playlistId);
      case 'shared':
        return ListViewHelper.updateShared(trackId, state, activeShoutOutPath);
      default:
        return { ready: false };
    }
  }

  public static updatePlaylists(trackId: any, state: any, activeShoutOutPath?: string, playlistId?: string): IListViewResult {
    let playlists = [...state.firebase.playlists];
    let shoutouts = [...state.firebase.shoutouts];
    // always reset sharedlist (in case a shared item was playing when playlist track was played)
    let sharedlist = ListViewHelper.reset([...state.firebase.sharedlist]);
    let currentTrackId = state.player.currentTrackId;
    let playing = !state.player.playing; // new playing state is always assumed the opposite unless the following...
    if (trackId) {
      if (trackId !== currentTrackId) {
        // changing track, always play new track
        playing = true;
      }
      // IMP: must come after above
      // always ensure currentTrackId is set to incoming track
      currentTrackId = trackId;
    }
    console.log(`playlistId: ${playlistId}`);
      
    // find playlist
    let playlistIndex = -1;
    for (let i = 0; i < playlists.length; i++) {
      if (playlistId) {
        if (playlistId === playlists[i].id) {
          playlistIndex = i;
          break;
        }
      } else if (trackId) {
        // find from playlist
        // TODO: Potential error here if the same track exists on 2 of more different playlists
        for (let t of playlists[i].tracks) {
          if (t.id === trackId) {
            playlistId = playlists[i].id;
            playlistIndex = i;
            break;
          }
        }
      }
        
    }
    console.log(`playlistIndex: ${playlistIndex}`);
    // determine playlist state first
    if (playlistIndex > -1) {
      if (playlists[playlistIndex].tracks.length === 0) {
        return {
          ready: false,
          msg: `Playlist is empty! Add some tracks to play.`
        };
      } else {
        // update current playlist state
        let playFirst = true;
        for (let t of playlists[playlistIndex].tracks) {
          if (trackId) {
            // when track is used, playlist state is determined by the track
            playFirst = false;
            // explicit track
            if (trackId === t.id) {
              t.playing = playing;
              activeShoutOutPath = SOPUtils.getShoutOutPath(t, shoutouts);
              playlists[playlistIndex].playing = playing;
              console.log(`setting track playing: ${t.playing}`);
            } else {
              // reset all others to off
              t.playing = false;
            }
          } else {
            // no track specified (play from playlist view)
            // find if any are currently playing
            if (t.playing) {
              currentTrackId = t.id;
              activeShoutOutPath = SOPUtils.getShoutOutPath(t, shoutouts);
              // toggle off
              playing = false;
              t.playing = playing;
              playlists[playlistIndex].playing = playing;
              playFirst = false;
            }
          }
        }

        if (playFirst) {
          if (playlists[playlistIndex].tracks[0].id !== currentTrackId) {
            // changing track, always play new track
            playing = true;
          }
          playlists[playlistIndex].tracks[0].playing = playing;
          playlists[playlistIndex].playing = playing;
          currentTrackId = playlists[playlistIndex].tracks[0].id;
          activeShoutOutPath = SOPUtils.getShoutOutPath(playlists[playlistIndex].tracks[0], shoutouts);
        }

        // always reset others to be clean
        for (let p of playlists) {
          if (p.id !== playlistId) {
            p.playing = false;
            for (let t of p.tracks) {
              t.playing = false;
            }
          }
        }
        console.log(`playlists[playlistIndex].playing: ${playlists[playlistIndex].playing}`);
        return {
          ready: true,
          trackId: currentTrackId,
          activeShoutOutPath,
          playing,
          state: { playlists, sharedlist }
        }
      }
    }
  }  

  public static updateShared(trackId: any, state: any, activeShoutOutPath: string): IListViewResult {
    // always reset playlists (in case a playlist track was playing when shared track was played)
    let playlists = ListViewHelper.reset([...state.firebase.playlists], true);
    let sharedlist = [...state.firebase.sharedlist];
    let playing = !state.player.playing; // new playing state is always assumed the opposite unless the following...
    if (trackId) {
      if (state.player.activeShoutOutPath !== activeShoutOutPath) {
        // since shared shoutouts could have many of same tracks
        // use shoutoutpath to determine if different
        // changing shared, always play new shared
        playing = true;
      }
    }
    for (let shared of sharedlist) {
      if (shared.trackId === trackId) {
        shared.playing = playing;
      } else {
        shared.playing = false;
      }
    }
    return {
      ready: true,
      trackId,
      activeShoutOutPath,
      playing,
      state: { playlists, sharedlist }
    }
  }

  /**
   * Reset playing: false
   **/
  public static reset(list: Array<any>, isPlaylists?: boolean): Array<any> {
    for (let item of list) {
      item.playing = false;

      if (isPlaylists && item.tracks) {
        for (let t of item.tracks) {
          t.playing = false;
        }
      }
    }
    return list;
  }
}