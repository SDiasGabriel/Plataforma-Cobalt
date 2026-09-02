import { Injectable, signal } from '@angular/core';

export type ErrorDialogData = {
  message: string;
  code?: string;
};

@Injectable({
  providedIn: 'root',
})
export class ErrorDialogService {
  private readonly dialogState = signal<ErrorDialogData | null>(null);

  readonly dialog = this.dialogState.asReadonly();

  open(data: ErrorDialogData): void {
    this.dialogState.set(data);
  }

  close(): void {
    this.dialogState.set(null);
  }
}
