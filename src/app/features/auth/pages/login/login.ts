import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../../core/auth/auth.service';
import { SHARED_IMPORTS } from '../../../../shared/shared-imports/shared';

@Component({
  selector: 'app-login',
  imports: [...SHARED_IMPORTS],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  email = 'ssorpreso@gmail.com';
  password = '@Cobalt1234';
  keepLogged = true;
  showPassword = false;

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
  ) {}

  submitLogin(): void {
    this.authService.login();

    const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') ?? '/dashboard';
    this.router.navigateByUrl(returnUrl);
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  protected navigateToCadastro(): void {
    this.router.navigateByUrl('/auth/cadastro');
  }
}
