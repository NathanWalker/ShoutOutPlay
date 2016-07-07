import {Input} from '@angular/core';

// app
import {ReuseComponent} from '../../core.framework/';

@ReuseComponent({
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