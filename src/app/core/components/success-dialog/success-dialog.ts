import { Component, inject } from '@angular/core';
import { SuccessDialogService } from '../../services/success-dialog.service';

@Component({
  selector: 'app-success-dialog',
  imports: [],
  templateUrl: './success-dialog.html',
  styleUrl: './success-dialog.scss',
})
export class SuccessDialog {
  readonly successDialogService = inject(SuccessDialogService);
}
