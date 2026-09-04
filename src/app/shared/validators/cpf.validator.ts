import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const CPF_LENGTH = 11;

export function onlyCpfDigits(value: string): string {
  return value.replace(/\D/g, '');
}

export function isValidCpf(value: string): boolean {
  const cpf = onlyCpfDigits(value);

  if (cpf.length !== CPF_LENGTH || /^(\d)\1+$/.test(cpf)) {
    return false;
  }

  const firstDigit = calculateCpfDigit(cpf.slice(0, 9));
  const secondDigit = calculateCpfDigit(`${cpf.slice(0, 9)}${firstDigit}`);

  return cpf === `${cpf.slice(0, 9)}${firstDigit}${secondDigit}`;
}

export function cpfValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = String(control.value ?? '');

    if (!value) {
      return null;
    }

    return isValidCpf(value) ? null : { cpf: true };
  };
}

function calculateCpfDigit(base: string): number {
  const initialWeight = base.length + 1;
  const sum = base
    .split('')
    .reduce((total, digit, index) => total + Number(digit) * (initialWeight - index), 0);
  const remainder = (sum * 10) % 11;

  return remainder === 10 ? 0 : remainder;
}
