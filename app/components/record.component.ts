// angular
import {Component} from 'angular2/core';

// libs
import {TNSFontIconPipe} from 'nativescript-ng2-fonticon';

@Component({
  selector: 'record',
  template: `
    <ActionBar title="Record"> 
      <ActionItem (tap)="record()" ios.position="right" android.position="popup">
        <Button class="fa" [text]="'fa-circle' | fonticon"></Button>
      </ActionItem>
    </ActionBar>
    <StackLayout class="record-view">
      <Label text="TODO: Record"></Label>
    </StackLayout>
  `,
  pipes: [TNSFontIconPipe]
})
export class RecordComponent {

  public record() {
    console.log('record');
  }  
}