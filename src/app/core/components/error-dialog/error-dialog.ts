import { Component, inject } from '@angular/core';
import { ErrorDialogService } from '../../services/error-dialog.service';

@Component({
  selector: 'app-error-dialog',
  imports: [],
  templateUrl: './error-dialog.html',
  styleUrl: './error-dialog.scss',
})
export class ErrorDialog {
  readonly errorDialogService = inject(ErrorDialogService);
}
