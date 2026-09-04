import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-topbar',
  imports: [],
  templateUrl: './topbar.html',
  styleUrl: './topbar.scss',
})
export class Topbar {
  isLoggingOut = false;

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
  ) {}

  logout(): void {
    if (this.isLoggingOut) {
      return;
    }

    this.isLoggingOut = true;

    this.authService.logout()
      .pipe(finalize(() => {
        this.isLoggingOut = false;
      }))
      .subscribe({
        next: () => {
          this.router.navigateByUrl('/auth/login');
        },
        error: () => {
          this.authService.clearSession();
          this.router.navigateByUrl('/auth/login');
        },
      });
  }
}
