import {Component, Input} from '@angular/core';

@Component({
  // moduleId: module.id,
  selector: 'EmptyView',
  templateUrl: './shared/shoutoutplay/components/empty.component.html'
})
export class EmptyComponent {
  @Input() icon: string; 
  @Input() text: string; 
}