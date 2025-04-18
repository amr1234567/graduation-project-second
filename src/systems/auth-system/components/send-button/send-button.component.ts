import {Component, HostBinding, Input} from '@angular/core';

@Component({
  selector: 'button[sendButton]',
  imports: [],
  template: `<ng-content></ng-content>`,
  styleUrl: './send-button.component.scss'
})
export class SendButtonComponent {
  @HostBinding('attr.type') @Input() type: string = 'submit'; // Set the button type
  @HostBinding('class') @Input() customClass: string = ''; // Allows custom styling
  @HostBinding('disabled') @Input() disabled: boolean = false; // Handle disabled state
}
