import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder, Validators } from '@angular/forms';
import { Observable, catchError, debounceTime, distinctUntilChanged, finalize, of, switchMap } from 'rxjs';
import { SuccessDialogService } from '../../../core/services/success-dialog.service';
import { COUNTRY_DIAL_CODES } from '../../../shared/constants/country-dial-codes';
import { SHARED_IMPORTS } from '../../../shared/shared-imports/shared';
import { cnpjValidator, onlyCnpjDigits } from '../../../shared/validators/cnpj.validator';
import { Cnae } from '../models/cnae.model';
import { CompanyRegister } from '../models/company-register.model';
import { CnaeService } from '../services/cnae.service';
import { CompanyService } from '../services/company.service';

@Component({
  selector: 'app-company-register-panel',
  imports: [...SHARED_IMPORTS],
  templateUrl: './company-register-panel.html',
  styleUrl: './company-register-panel.scss',
})
export class CompanyRegisterPanel {
  private readonly formBuilder = inject(NonNullableFormBuilder);
  private readonly destroyRef = inject(DestroyRef);
  private readonly companyService = inject(CompanyService);
  private readonly cnaeService = inject(CnaeService);
  private readonly successDialogService = inject(SuccessDialogService);

  readonly countryDialCodes = COUNTRY_DIAL_CODES;
  isLoading = false;
  isSearchingCnaes = false;
  cnaeResults: Cnae[] = [];
  selectedCnae: Cnae | null = null;
  cnaeSearchTerm = '';
  hasSearchedCnaes = false;

  companyForm = this.formBuilder.group({
    cnpj: ['', [Validators.required, cnpjValidator()]],
    nomeFantasia: ['', Validators.required],
    razaoSocial: ['', Validators.required],
    cnae: ['', Validators.required],
    perfil: ['socio', Validators.required],
    ddi: ['55', Validators.required],
    celular: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
  });

  constructor() {
    this.companyForm.get('cnpj')?.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => {
        this.formatControlValue('cnpj', this.formatCnpj(value));
      });

    this.companyForm.get('celular')?.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => {
        this.formatControlValue('celular', this.formatPhone(value));
      });

    this.companyForm.get('cnae')?.valueChanges
      .pipe(
        debounceTime(350),
        distinctUntilChanged(),
        switchMap((value) => this.searchCnaes(value)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((cnaes) => {
        this.cnaeResults = cnaes;
        this.isSearchingCnaes = false;
        this.hasSearchedCnaes = !!this.cnaeSearchTerm;
      });
  }

  get isCnpjInvalid(): boolean {
    const cnpjControl = this.companyForm.get('cnpj');

    return !!cnpjControl
      && cnpjControl.invalid
      && (cnpjControl.dirty || cnpjControl.touched);
  }

  get cnpjErrorMessage(): string {
    const cnpjControl = this.companyForm.get('cnpj');

    if (!cnpjControl || !(cnpjControl.dirty || cnpjControl.touched)) {
      return '';
    }

    if (cnpjControl.hasError('required')) {
      return 'Informe o CNPJ da empresa.';
    }

    if (cnpjControl.hasError('cnpj')) {
      return 'CNPJ invalido.';
    }

    return '';
  }

  get isEmailInvalid(): boolean {
    const emailControl = this.companyForm.get('email');

    return !!emailControl
      && emailControl.invalid
      && (emailControl.dirty || emailControl.touched);
  }

  get emailErrorMessage(): string {
    const emailControl = this.companyForm.get('email');

    if (!emailControl || !(emailControl.dirty || emailControl.touched)) {
      return '';
    }

    if (emailControl.hasError('required')) {
      return 'Informe o e-mail.';
    }

    if (emailControl.hasError('email')) {
      return 'E-mail invalido.';
    }

    return '';
  }

  get canSubmit(): boolean {
    return this.companyForm.valid && !this.isLoading;
  }

  submitCompany(): void {
    if (this.companyForm.invalid) {
      this.companyForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const formValue = this.companyForm.getRawValue();
    const payload: CompanyRegister = {
      cnpj: onlyCnpjDigits(formValue.cnpj),
      nomeFantasia: formValue.nomeFantasia,
      razaoSocial: formValue.razaoSocial,
      cnae: this.selectedCnae?.codigo ?? formValue.cnae,
      perfil: formValue.perfil,
      telefone: `${formValue.ddi} ${this.onlyDigits(formValue.celular)}`,
      email: formValue.email,
    };

    this.companyService.registerCompany(payload)
      .pipe(finalize(() => {
        this.isLoading = false;
      }))
      .subscribe({
        next: () => {
          this.successDialogService.open({
            message: 'Empresa cadastrada com sucesso.',
          });
          this.companyForm.reset({
            cnpj: '',
            nomeFantasia: '',
            razaoSocial: '',
            cnae: '',
            perfil: 'socio',
            ddi: '55',
            celular: '',
            email: '',
          });
          this.selectedCnae = null;
          this.cnaeResults = [];
          this.cnaeSearchTerm = '';
          this.hasSearchedCnaes = false;
        },
        error: () => {
          // O errorInterceptor abre o dialog global com a mensagem retornada pela API.
        },
      });
  }

  selectCnae(cnae: Cnae): void {
    this.selectedCnae = cnae;
    this.cnaeResults = [];
    this.hasSearchedCnaes = false;
    this.companyForm.get('cnae')?.setValue(this.formatCnaeOption(cnae), { emitEvent: false });
  }

  onCnaeBlur(): void {
    window.setTimeout(() => {
      this.cnaeResults = [];
      this.hasSearchedCnaes = false;
    }, 180);
  }

  private searchCnaes(value: string): Observable<Cnae[]> {
    const term = value.trim();
    this.cnaeSearchTerm = term;
    this.selectedCnae = null;
    this.hasSearchedCnaes = false;

    if (term.length < 2) {
      this.isSearchingCnaes = false;
      return of([]);
    }

    this.isSearchingCnaes = true;

    return this.cnaeService.searchByDescriptionOrCode(term)
      .pipe(catchError(() => of([])));
  }

  protected formatCnaeOption(cnae: Cnae): string {
    return [cnae.codigo, cnae.descricao].filter(Boolean).join(' ');
  }

  private formatControlValue(controlName: 'cnpj' | 'celular', formattedValue: string): void {
    const control = this.companyForm.get(controlName);

    if (control?.value === formattedValue) {
      return;
    }

    control?.setValue(formattedValue, { emitEvent: false });
  }

  private formatCnpj(value: string): string {
    const digits = this.onlyDigits(value).slice(0, 14);

    if (digits.length <= 2) {
      return digits;
    }

    if (digits.length <= 5) {
      return `${digits.slice(0, 2)}.${digits.slice(2)}`;
    }

    if (digits.length <= 8) {
      return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5)}`;
    }

    if (digits.length <= 12) {
      return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8)}`;
    }

    return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8, 12)}-${digits.slice(12)}`;
  }

  private formatPhone(value: string): string {
    const digits = this.onlyDigits(value).slice(0, 11);

    if (digits.length <= 2) {
      return digits ? `(${digits}` : '';
    }

    if (digits.length <= 6) {
      return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    }

    if (digits.length <= 10) {
      return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
    }

    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  }

  private onlyDigits(value: string): string {
    return value.replace(/\D/g, '');
  }
}
