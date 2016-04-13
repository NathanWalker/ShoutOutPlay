// angular
import {Component} from 'angular2/core';

// app
import {PlaylistService} from '../frameworks/shoutoutplay.framework/index';

@Component({
  selector: 'playlist',
  template: `
    <ActionBar title="Playlists">
      <NavigationButton text="First" android.systemIcon="ic_menu_back"></NavigationButton>
      <ActionItem text="Add" (tap)="add()"></ActionItem>
    </ActionBar>
    <StackLayout>
      <ListView [items]="playlistService.playlists | async" row="1" colSpan="2" height="300">
        <template #name="item" #odd="odd" #even="even">
          <StackLayout [class.odd]="odd" [class.even]="even" class="list-item">
            <Label [text]="name"></Label>
          </StackLayout>
        </template>
      </ListView>
    </StackLayout>
  `
})
export class PlaylistComponent {

  constructor(public playlistService: PlaylistService) {
    playlistService.playlists.subscribe((playlists) => {
      console.log(`playlists:`);
      console.log(playlists);
    });
  }

  public add() {
    console.log('add');
  }  
}