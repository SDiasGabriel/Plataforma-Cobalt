import { Component, EventEmitter, Input, Output } from '@angular/core';

export type InternalButtonSize = 'sm' | 'md';
export type InternalButtonType = 'button' | 'submit' | 'reset';

@Component({
  selector: 'app-internal-button',
  imports: [],
  templateUrl: './internal-button.html',
  styleUrl: './internal-button.scss',
})
export class InternalButton {
  @Input() label = '';
  @Input() type: InternalButtonType = 'button';
  @Input() iconStartSrc = '';
  @Input() iconStartAlt = '';
  @Input() iconEndSrc = '';
  @Input() iconEndAlt = '';
  @Input() size: InternalButtonSize = 'md';
  @Input() disabled = false;
  @Input() fullWidth = false;

  @Output() buttonClick = new EventEmitter<MouseEvent>();

  onClick(event: MouseEvent): void {
    if (this.disabled) {
      return;
    }

    this.buttonClick.emit(event);
  }
}
