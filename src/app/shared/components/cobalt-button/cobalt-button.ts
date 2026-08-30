import { Component, EventEmitter, Input, Output } from '@angular/core';

export type CobaltButtonSize = 'sm' | 'md';
export type CobaltButtonType = 'button' | 'submit' | 'reset';

@Component({
  selector: 'app-cobalt-button',
  imports: [],
  templateUrl: './cobalt-button.html',
  styleUrl: './cobalt-button.scss',
})
export class CobaltButton {
  @Input() label = '';
  @Input() type: CobaltButtonType = 'button';
  @Input() iconStartSrc = '';
  @Input() iconStartAlt = '';
  @Input() iconEndSrc = '';
  @Input() iconEndAlt = '';
  @Input() size: CobaltButtonSize = 'md';
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
