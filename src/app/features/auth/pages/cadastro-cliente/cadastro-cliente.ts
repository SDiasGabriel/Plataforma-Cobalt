import { Component, inject } from '@angular/core';
import { AbstractControl, NonNullableFormBuilder, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../../../../core/auth/auth.service';
import { ErrorDialogService } from '../../../../core/services/error-dialog.service';
import { SuccessDialogService } from '../../../../core/services/success-dialog.service';
import { Register } from '../../models/register.model';
import { SHARED_IMPORTS } from '../../../../shared/shared-imports/shared';

@Component({
  selector: 'app-cadastro-cliente',
  imports: [...SHARED_IMPORTS],
  templateUrl: './cadastro-cliente.html',
  styleUrl: './cadastro-cliente.scss',
})
export class CadastroCliente {
  private readonly formBuilder = inject(NonNullableFormBuilder);
  private readonly authService = inject(AuthService);
  private readonly errorDialogService = inject(ErrorDialogService);
  private readonly successDialogService = inject(SuccessDialogService);
  private readonly router = inject(Router);

  registerForm = this.formBuilder.group({
    apelido: ['', Validators.required],
    nome: ['', Validators.required],
    ddi: ['55', Validators.required],
    celular: ['(11) X.XXXX-XXXX', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    senha: ['', [Validators.required, Validators.minLength(8)]],
    confirmarSenha: ['', Validators.required],
    acceptedTerms: [false, Validators.requiredTrue],
  }, { validators: this.passwordMatchValidator });

  isLoading = false;
  showPassword = false;
  showConfirmPassword = false;
  selectedDocument: File | null = null;
  selectedDocumentName = '';

  get passwordType(): 'password' | 'text' {
    return this.showPassword ? 'text' : 'password';
  }

  get confirmPasswordType(): 'password' | 'text' {
    return this.showConfirmPassword ? 'text' : 'password';
  }

  get passwordIconSrc(): string {
    return this.showPassword
      ? '/assets/icons/actions/ico_ver.png'
      : '/assets/icons/actions/ico_esconder.png';
  }

  get confirmPasswordIconSrc(): string {
    return this.showConfirmPassword
      ? '/assets/icons/actions/ico_ver.png'
      : '/assets/icons/actions/ico_esconder.png';
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onDocumentSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    this.selectedDocument = file ?? null;
    this.selectedDocumentName = file?.name ?? '';
  }

  removeDocument(fileInput: HTMLInputElement): void {
    this.selectedDocument = null;
    this.selectedDocumentName = '';
    fileInput.value = '';
  }

  async submitRegister(): Promise<void> {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      this.errorDialogService.open({
        message: this.registerForm.hasError('passwordMismatch')
          ? 'As senhas informadas não conferem.'
          : 'Preencha todos os campos obrigatórios para continuar.',
      });
      return;
    }

    this.isLoading = true;
    const formValue = this.registerForm.getRawValue();
    let documento: string | null = null;

    try {
      documento = this.selectedDocument
        ? await this.convertFileToBase64(this.selectedDocument)
        : null;
    } catch {
      this.isLoading = false;
      this.errorDialogService.open({
        message: 'Não foi possível ler o documento selecionado.',
      });
      return;
    }
    const payload: Register = {
      apelido: formValue.apelido,
      nome: formValue.nome,
      telefone: `${formValue.ddi} ${formValue.celular}`,
      email: formValue.email,
      senha: formValue.senha,
      documento,
    };

    this.authService.registerClient(payload)
      .pipe(finalize(() => {
        this.isLoading = false;
      }))
      .subscribe({
        next: (response) => {
          this.successDialogService.open({
            message: response.mensagem ?? 'Cadastro realizado com sucesso.',
          });
          this.router.navigateByUrl('/auth/login');
        },
        error: () => {
          // O errorInterceptor abre o dialog global com a mensagem retornada pela API.
        },
      });
  }

  private passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const senha = control.get('senha')?.value;
    const confirmarSenha = control.get('confirmarSenha')?.value;

    if (!senha || !confirmarSenha) {
      return null;
    }

    return senha === confirmarSenha ? null : { passwordMismatch: true };
  }

  private convertFileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        const result = reader.result?.toString() ?? '';
        resolve(result.includes(',') ? result.split(',')[1] : result);
      };
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });
  }
}
