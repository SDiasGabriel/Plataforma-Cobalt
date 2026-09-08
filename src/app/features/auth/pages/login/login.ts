import { Component, DestroyRef, inject } from '@angular/core';
import { NonNullableFormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, EMPTY, finalize } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthService } from '../../../../core/auth/auth.service';
import { getApiErrorMessage } from '../../../../core/http/api-error';
import { SHARED_IMPORTS } from '../../../../shared/shared-imports/shared';

@Component({
  selector: 'app-login',
  imports: [...SHARED_IMPORTS],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private readonly formBuilder = inject(NonNullableFormBuilder);
  private readonly destroyRef = inject(DestroyRef);

  loginForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    senha: ['', Validators.required],
    keepLogged: [true],
  });

  showPassword = false;
  isLoading = false;
  loginErrorMessage = '';

  get isEmailInvalid(): boolean {
    const emailControl = this.loginForm.get('email');

    return !!emailControl
      && ((emailControl.invalid && (emailControl.dirty || emailControl.touched)) || !!this.loginErrorMessage);
  }

  get isPasswordInvalid(): boolean {
    const passwordControl = this.loginForm.get('senha');

    return !!passwordControl
      && ((passwordControl.invalid && (passwordControl.dirty || passwordControl.touched)) || !!this.loginErrorMessage);
  }

  get passwordInputType(): 'password' | 'text' {
    return this.showPassword ? 'text' : 'password';
  }

  get passwordIconSrc(): string {
    return this.showPassword
      ? '/assets/icons/actions/ico_ver.png'
      : '/assets/icons/actions/ico_esconder.png';
  }

  get passwordIconAlt(): string {
    return this.showPassword ? 'Ocultar senha' : 'Mostrar senha';
  }

  constructor(
    private readonly authService: AuthService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
  ) {
    this.loginForm.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        if (this.loginErrorMessage) {
          this.loginErrorMessage = '';
        }
      });
  }

  submitLogin(): void {
    if (this.isLoading) {
      return;
    }

    this.loginErrorMessage = '';

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.loginErrorMessage = 'Preencha seu e-mail e senha para acessar.';
      return;
    }

    this.isLoading = true;
    const { email, senha, keepLogged } = this.loginForm.getRawValue();

    this.authService
      .login({
        Email: email,
        Senha: senha,
      }, keepLogged)
      .pipe(
        catchError((error) => {
          this.loginForm.markAllAsTouched();
          this.loginErrorMessage = getApiErrorMessage(error, 'E-mail ou senha inválidos.');

          return EMPTY;
        }),
        finalize(() => {
          this.isLoading = false;
        }),
      )
      .subscribe({
        next: () => {
          const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') ?? '/dashboard';
          this.router.navigateByUrl(returnUrl);
        },
      });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  protected navigateToCadastro(): void {
    this.router.navigateByUrl('/auth/cadastro');
  }
}
