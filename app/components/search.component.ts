// angular
import {Component} from 'angular2/core';

// nativescript
import {NS_ROUTER_DIRECTIVES} from 'nativescript-angular/router';
import {NS_DIRECTIVES} from "nativescript-angular/directives";

// libs
import {TNSFontIconPipe} from 'nativescript-ng2-fonticon/nativescript-ng2-fonticon';

@Component({
  selector: 'search',
  template: `
    <ActionBar title="ShoutOutPlay"> 
      <ActionItem (tap)="toggleMenu()">
        <Button class="fa" [text]="'fa-bars' | fonticon"></Button>
      </ActionItem>
      <ActionItem [nsRouterLink]="['/Record']" ios.position="right" android.position="popup">
        <Button class="fa" [text]="'fa-microphone' | fonticon"></Button>
      </ActionItem>
    </ActionBar>
    <StackLayout>
      <Label text="Search tracks to add to a playlist..." class="instruction"></Label>
      <CardView margin="5" radius="5">
        <SearchBar (submit)="search($event)" (clear)="clear()"></SearchBar>
      </CardView>
    <StackLayout>
  `,
  directives: [
    NS_ROUTER_DIRECTIVES,
    NS_DIRECTIVES
  ],
  pipes: [TNSFontIconPipe]
})
export class SearchComponent {

  public toggleMenu() {
    console.log('test')
  }

  public search(e: any) {
    if (e && e.object) {
      console.log(e.object.text);
    }
  }

  public clear() {
    console.log('clear');
  }  
}