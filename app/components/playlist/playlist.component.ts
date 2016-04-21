// angular
import {Component} from 'angular2/core';

// app
import {PlaylistService, PlaylistStateI} from '../../frameworks/shoutoutplay.framework/index';

@Component({
  selector: 'playlist',
  template: `
    <ActionBar title="Playlists">
      <NavigationButton text="First" android.systemIcon="ic_menu_back"></NavigationButton>
      <ActionItem text="Add" (tap)="add()"></ActionItem>
    </ActionBar>
    <StackLayout>
      <ListView [items]="(playlistService.state$ | async)?.lists" row="1" colSpan="2" height="300">
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
    playlistService.state$.subscribe((state: PlaylistStateI) => {
      console.log(`playlists:`);
      console.log(state.lists);
    });
  }

  public add() {
    console.log('add');
  }  
}