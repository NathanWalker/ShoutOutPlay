# ShoutOutPlay

Join the Waffle Board here to track progress:
https://waffle.io/NathanWalker/ShoutOutPlay/join

## Setup

```
brew install xcproj  // tmp until {N} 1.7.2 supports XCode 7.3 cocoapods issue
tns install

// run it (you will see TS warnings/errors)..it's ok, proceed)
tns emulate ios

// Or you can use VS Code debugger :)
```

#### IF you run into the XCode 7.3 CocoaPods issue

Run this once:

```
npm run fix_xcode
```

ShoutOutPlay is a music app allowing live shout outs to be recorded and mixed in with your favorite music playlists for corporate events, parties, weddings and get togethers.

It allows users to search for any music track via Spotify integration. They can preview/play the tracks and then choose to add them to a new or existing playlist they create. What makes ShoutOutPlay unique is it's ability to allow users to record "Shout Outs" which will mix into the music and play on a specific track they choose or can be played at random during the playlist playback if they choose.

When the "Shout Out" plays, the currently playing track volume will fade down about .3 points to allow the "Shout Out" to fade in and play over top of the playing track. When the "Shout Out" is done, the currently playing track volume will fades back in.

Imagine you are at a corporate event for Telerik and the Vice President of Technology, Hristo Kosev, loves Michael Jackson's "Wanna Be Startin' Somethin'", so during the event or after-party, music is playing and then you hear "Wanna Be Startin' Somethin'" start playing, then Hristo's voice fades in, "This goes out to all our developers to say thanks that you all have truly started something special here with NativeScript. Thank You."

The beauty of this is it makes the party take on a whole new meaning with personalized dedications and give the guests as a way to participate as an iPad with the app running could be setup in an area that would allow guest to walk up to it and record their own "Shout Outs" to people at the event.

UI Comp

![Status](https://cdn.filestackcontent.com/RqD32VFSlWM1vLBPrgpg?v=0)

![Comp](https://cdn.filestackcontent.com/NiGHnUhTQuqp4KUxsRlr?v=0)