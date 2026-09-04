export interface CountryDialCode {
  country: string;
  iso: string;
  ddi: string;
  label: string;
}

export const COUNTRY_DIAL_CODES: CountryDialCode[] = [
  {
    country: 'Brasil',
    iso: 'BR',
    ddi: '55',
    label: '055',
  },
  {
    country: 'Estados Unidos',
    iso: 'US',
    ddi: '1',
    label: '001',
  },
  {
    country: 'Portugal',
    iso: 'PT',
    ddi: '351',
    label: '351',
  },
];
