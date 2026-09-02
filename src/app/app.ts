import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ErrorDialog } from './core/components/error-dialog/error-dialog';
import { SuccessDialog } from './core/components/success-dialog/success-dialog';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ErrorDialog, SuccessDialog],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('Cobalt');
}
