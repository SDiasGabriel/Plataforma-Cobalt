import { FormControl } from '@angular/forms';
import { cpfValidator, isValidCpf, onlyCpfDigits } from './cpf.validator';

describe('cpfValidator', () => {
  it('should remove non-digit characters', () => {
    expect(onlyCpfDigits('529.982.247-25')).toBe('52998224725');
  });

  it('should validate a valid CPF with mask', () => {
    expect(isValidCpf('529.982.247-25')).toBe(true);
  });

  it('should validate a valid CPF without mask', () => {
    expect(isValidCpf('52998224725')).toBe(true);
  });

  it('should reject CPF with repeated digits', () => {
    expect(isValidCpf('111.111.111-11')).toBe(false);
  });

  it('should reject CPF with invalid check digits', () => {
    expect(isValidCpf('529.982.247-24')).toBe(false);
  });

  it('should return a validation error for invalid CPF', () => {
    const control = new FormControl('123.456.789-00');

    expect(cpfValidator()(control)).toEqual({ cpf: true });
  });

  it('should not return a validation error for empty values', () => {
    const control = new FormControl('');

    expect(cpfValidator()(control)).toBeNull();
  });
});
