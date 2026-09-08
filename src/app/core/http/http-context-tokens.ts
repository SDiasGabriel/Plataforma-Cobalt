import { HttpContextToken } from '@angular/common/http';

export const SKIP_ERROR_DIALOG = new HttpContextToken<boolean>(() => false);
