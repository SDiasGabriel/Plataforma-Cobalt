import { Component, EventEmitter, forwardRef, Input, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export type CobaltInputType = 'email' | 'number' | 'password' | 'search' | 'tel' | 'text';

@Component({
  selector: 'app-cobalt-input',
  imports: [],
  templateUrl: './cobalt-input.html',
  styleUrl: './cobalt-input.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CobaltInput),
      multi: true,
    },
  ],
})
export class CobaltInput implements ControlValueAccessor {
  @Input() label = '';
  @Input() placeholder = '';
  @Input() type: CobaltInputType = 'text';
  @Input() iconEndSrc = '';
  @Input() iconEndAlt = '';
  @Input() iconEndButton = false;
  @Input() disabled = false;
  @Input() invalid = false;
  @Input() maxlength: number | null = null;
  @Input() readonly = false;
  @Input() fullWidth = true;

  @Output() iconEndClick = new EventEmitter<MouseEvent>();

  value = '';

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(value: string | null): void {
    this.value = value ?? '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.value = input.value;
    this.onChange(this.value);
  }

  markAsTouched(): void {
    this.onTouched();
  }

  onIconEndClick(event: MouseEvent): void {
    if (this.disabled || !this.iconEndButton) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    this.iconEndClick.emit(event);
  }
}
