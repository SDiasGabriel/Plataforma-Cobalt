import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { ErrorDialogService } from '../services/error-dialog.service';
import { getApiErrorCode, getApiErrorMessage } from './api-error';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const errorDialogService = inject(ErrorDialogService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error) => {
      if (error instanceof HttpErrorResponse && error.status === 401) {
        authService.clearSession();
        router.navigateByUrl('/auth/login');

        return throwError(() => error);
      }

      errorDialogService.open({
        message: getApiErrorMessage(error),
        code: getApiErrorCode(error),
      });

      return throwError(() => error);
    }),
  );
};
