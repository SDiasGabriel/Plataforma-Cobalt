import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Observable, map, tap, timeout } from 'rxjs';
import { Login, LoginResponse } from '../../features/auth/models/login.model';
import { environment } from '../../../environments/environment';
import { Register, RegisterResponse } from '../../features/auth/models/register.model';
import { UserSessionService } from '../user/user-session.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly tokenKey = 'cobalt_token';
  private readonly refreshTokenKey = 'cobalt_refresh_token';
  private readonly apiUrl = environment.apiUrl;

  constructor(
    @Inject(PLATFORM_ID) private readonly platformId: object,
    private readonly http: HttpClient,
    private readonly userSessionService: UserSessionService,
  ) {}

  login(credentials: Login): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.apiUrl}/api/Autenticacao/Login`, credentials)
      .pipe(
        timeout(150000),
        map((response) => {
          if (!response.token) {
            throw response;
          }

          return response;
        }),
        tap((response) => this.saveSession(response)),
      );
  }

  registerClient(data: Register): Observable<RegisterResponse> {
    return this.http
      .post<RegisterResponse>(`${this.apiUrl}/api/Usuario/Inserir`, data)
      .pipe(timeout(150000));
  }

  logout(): void {
    this.userSessionService.clear();

    if (!this.isBrowser()) {
      return;
    }

    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.refreshTokenKey);
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

  getRefreshToken(): string | null {
    if (!this.isBrowser()) {
      return null;
    }

    return localStorage.getItem(this.refreshTokenKey);
  }

  private saveSession(response: LoginResponse): void {
    if (!this.isBrowser()) {
      return;
    }

    if (response.token) {
      localStorage.setItem(this.tokenKey, response.token);
    }

    if (response.refreshToken) {
      localStorage.setItem(this.refreshTokenKey, response.refreshToken);
    }
  }

  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }
}
