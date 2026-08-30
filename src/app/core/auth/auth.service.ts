import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly tokenKey = 'cobalt_token';

  constructor(@Inject(PLATFORM_ID) private readonly platformId: object) {}

  login(token = 'fake-token'): void {
    if (!this.isBrowser()) {
      return;
    }

    localStorage.setItem(this.tokenKey, token);
  }

  logout(): void {
    if (!this.isBrowser()) {
      return;
    }

    localStorage.removeItem(this.tokenKey);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getToken(): string | null {
    if (!this.isBrowser()) {
      return null;
    }

    return localStorage.getItem(this.tokenKey);
  }

  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }
}
