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
  private readonly allowedDocumentTypes = ['application/pdf', 'image/png', 'image/jpeg'];
  private readonly maxDocumentSizeInBytes = 50 * 1024 * 1024;
  private readonly termsVersion = '2026-09-01';
  private readonly formBuilder = inject(NonNullableFormBuilder);
  private readonly authService = inject(AuthService);
  private readonly errorDialogService = inject(ErrorDialogService);
  private readonly successDialogService = inject(SuccessDialogService);
  private readonly router = inject(Router);

  registerForm = this.formBuilder.group({
    apelido: ['', Validators.required],
    nome: ['', Validators.required],
    cpf: ['', Validators.required],
    ddi: ['55', Validators.required],
    celular: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    senha: ['', [Validators.required, this.passwordPolicyValidator]],
    confirmarSenha: ['', Validators.required],
    acceptedTerms: [false, Validators.requiredTrue],
  }, { validators: this.passwordMatchValidator });

  isLoading = false;
  showPassword = false;
  showConfirmPassword = false;
  selectedDocument: File | null = null;
  selectedDocumentName = '';

  get canSubmit(): boolean {
    return this.registerForm.valid && !!this.selectedDocument && !this.isLoading;
  }

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

    if (!file) {
      this.selectedDocument = null;
      this.selectedDocumentName = '';
      return;
    }

    if (!this.allowedDocumentTypes.includes(file.type)) {
      this.clearDocumentInput(input);
      this.errorDialogService.open({
        message: 'Arquivo inválido. Envie um documento em PDF, PNG, JPG ou JPEG.',
      });
      return;
    }

    if (file.size > this.maxDocumentSizeInBytes) {
      this.clearDocumentInput(input);
      this.errorDialogService.open({
        message: 'O documento deve ter no máximo 50MB.',
      });
      return;
    }

    this.selectedDocument = file;
    this.selectedDocumentName = file.name;
  }

  removeDocument(fileInput: HTMLInputElement): void {
    this.clearDocumentInput(fileInput);
  }

  async submitRegister(): Promise<void> {
    if (this.registerForm.invalid || !this.selectedDocument) {
      this.registerForm.markAllAsTouched();
      this.errorDialogService.open({
        message: this.getRegisterValidationMessage(),
      });
      return;
    }

    this.isLoading = true;
    const formValue = this.registerForm.getRawValue();
    let documento: string | null = null;

    try {
      documento = await this.convertFileToBase64(this.selectedDocument);
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
      cpf: formValue.cpf,
      telefone: `${formValue.ddi} ${formValue.celular}`,
      email: formValue.email,
      senha: formValue.senha,
      documento,
      versaoTermos: this.termsVersion,
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

  private clearDocumentInput(fileInput: HTMLInputElement): void {
    this.selectedDocument = null;
    this.selectedDocumentName = '';
    fileInput.value = '';
  }

  private passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const senha = control.get('senha')?.value;
    const confirmarSenha = control.get('confirmarSenha')?.value;

    if (!senha || !confirmarSenha) {
      return null;
    }

    return senha === confirmarSenha ? null : { passwordMismatch: true };
  }

  private passwordPolicyValidator(control: AbstractControl): ValidationErrors | null {
    const value = String(control.value ?? '');

    if (!value) {
      return null;
    }

    const isValid = value.length >= 8
      && /[A-Z]/.test(value)
      && /[a-z]/.test(value)
      && /[0-9]/.test(value)
      && /[^A-Za-z0-9]/.test(value);

    return isValid ? null : { passwordPolicy: true };
  }

  private getRegisterValidationMessage(): string {
    if (this.registerForm.get('email')?.hasError('email')) {
      return 'Informe um e-mail válido para continuar.';
    }

    if (this.registerForm.get('senha')?.hasError('passwordPolicy')) {
      return 'A senha deve ter no mínimo 8 caracteres, com letra maiúscula, letra minúscula, número e caractere especial.';
    }

    if (this.registerForm.hasError('passwordMismatch')) {
      return 'As senhas informadas não conferem.';
    }

    if (!this.selectedDocument) {
      return 'Anexe o documento de identificação para continuar.';
    }

    if (this.registerForm.get('acceptedTerms')?.invalid) {
      return 'Aceite os termos de uso e a política de privacidade para continuar.';
    }

    return 'Preencha todos os campos obrigatórios para continuar.';
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
