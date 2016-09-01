import {Component, Input} from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'EmptyView',
  template: `
  <StackLayout class="full-page-message">
    <Label [text]="icon | fonticon" textWrap="true" class="fa full-page-message-label"></Label>
    <Label [text]="text" textWrap="true" class="full-page-message-label test-empty"></Label>
  </StackLayout>
  `
})
export class EmptyComponent {
  @Input() icon: string; 
  @Input() text: string; 
}