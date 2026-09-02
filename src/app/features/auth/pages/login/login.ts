import { Component, inject } from '@angular/core';
import { NonNullableFormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../../core/auth/auth.service';
import { getApiErrorCode, getApiErrorMessage } from '../../../../core/http/api-error';
import { ErrorDialogService } from '../../../../core/services/error-dialog.service';
import { SHARED_IMPORTS } from '../../../../shared/shared-imports/shared';

@Component({
  selector: 'app-login',
  imports: [...SHARED_IMPORTS],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private readonly formBuilder = inject(NonNullableFormBuilder);

  loginForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    senha: ['', Validators.required],
    keepLogged: [true],
  });

  showPassword = false;
  isLoading = false;

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
    private readonly errorDialogService: ErrorDialogService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
  ) {}

  submitLogin(): void {
    if (this.isLoading) {
      return;
    }

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.errorDialogService.open({
        message: 'Preencha seu e-mail e senha para acessar.',
      });
      return;
    }

    this.isLoading = true;
    const { email, senha } = this.loginForm.getRawValue();

    this.authService
      .login({
        Email: email,
        Senha: senha,
      })
      .subscribe({
        next: () => {
          this.isLoading = false;
          const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') ?? '/dashboard';
          this.router.navigateByUrl(returnUrl);
        },
        error: (error) => {
          this.isLoading = false;
          this.errorDialogService.open({
            message: getApiErrorMessage(error, 'E-mail ou senha inválidos.'),
            code: getApiErrorCode(error),
          });
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
