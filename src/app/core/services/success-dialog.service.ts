import { Injectable, signal } from '@angular/core';

export type SuccessDialogData = {
  message: string;
};

@Injectable({
  providedIn: 'root',
})
export class SuccessDialogService {
  private readonly dialogState = signal<SuccessDialogData | null>(null);

  readonly dialog = this.dialogState.asReadonly();

  open(data: SuccessDialogData): void {
    this.dialogState.set(data);
  }

  close(): void {
    this.dialogState.set(null);
  }
}
