import { Component } from '@angular/core';
import { SHARED_IMPORTS } from '../../../../shared/shared-imports/shared';

@Component({
  selector: 'app-cadastro-cliente',
  imports: [...SHARED_IMPORTS],
  templateUrl: './cadastro-cliente.html',
  styleUrl: './cadastro-cliente.scss',
})
export class CadastroCliente {
  apelido = 'Sam';
  nome = 'Samantha Pavan Sorpreso';
  ddi = '055';
  celular = '(11) 9.8151-5564';
  email = 'ssorpreso@gmail.com';
  senha = '12345678';
  confirmarSenha = '@Cobalt1234';
  acceptedTerms = false;
  showPassword = false;
  showConfirmPassword = false;
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

    this.selectedDocumentName = file?.name ?? '';
  }

  removeDocument(fileInput: HTMLInputElement): void {
    this.selectedDocumentName = '';
    fileInput.value = '';
  }
}
