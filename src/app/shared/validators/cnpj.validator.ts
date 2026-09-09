import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const CNPJ_LENGTH = 14;

export function onlyCnpjDigits(value: string): string {
  return value.replace(/\D/g, '');
}

export function isValidCnpj(value: string): boolean {
  const cnpj = onlyCnpjDigits(value);

  if (cnpj.length !== CNPJ_LENGTH || /^(\d)\1+$/.test(cnpj)) {
    return false;
  }

  const firstDigit = calculateCnpjDigit(cnpj.slice(0, 12));
  const secondDigit = calculateCnpjDigit(`${cnpj.slice(0, 12)}${firstDigit}`);

  return cnpj === `${cnpj.slice(0, 12)}${firstDigit}${secondDigit}`;
}

export function cnpjValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = String(control.value ?? '');

    if (!value) {
      return null;
    }

    return isValidCnpj(value) ? null : { cnpj: true };
  };
}

function calculateCnpjDigit(base: string): number {
  const weights = base.length === 12
    ? [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
    : [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const sum = base
    .split('')
    .reduce((total, digit, index) => total + Number(digit) * weights[index], 0);
  const remainder = sum % 11;

  return remainder < 2 ? 0 : 11 - remainder;
}
