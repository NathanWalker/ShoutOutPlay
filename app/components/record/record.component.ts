// angular
import {Component} from 'angular2/core';

// libs
import {TNSFontIconPipe} from 'nativescript-ng2-fonticon/nativescript-ng2-fonticon';

@Component({
  selector: 'record',
  template: `
    <ActionBar title="Record"> 
      <NavigationButton text="Back" android.systemIcon="ic_menu_back"></NavigationButton>
      <ActionItem (tap)="record()" ios.position="right" android.position="popup">
        <Button class="fa record-btn" [text]="'fa-circle' | fonticon"></Button>
      </ActionItem>
    </ActionBar>
    <StackLayout class="record-view full-page">
      <Label text="TODO: Wire up Record View" color="#fff" padding="20"></Label>
    </StackLayout>
  `,
  pipes: [TNSFontIconPipe]
})
export class RecordComponent {

  public record() {
    console.log('record');
  }  
}