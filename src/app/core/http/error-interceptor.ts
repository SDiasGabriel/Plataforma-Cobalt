import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { ErrorDialogService } from '../services/error-dialog.service';
import { getApiErrorCode, getApiErrorMessage } from './api-error';
import { SKIP_ERROR_DIALOG } from './http-context-tokens';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const errorDialogService = inject(ErrorDialogService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error) => {
      const skipErrorDialog = req.context.get(SKIP_ERROR_DIALOG);

      if (error instanceof HttpErrorResponse && error.status === 401 && !skipErrorDialog) {
        authService.clearSession();
        router.navigateByUrl('/auth/login');

        return throwError(() => error);
      }

      if (!skipErrorDialog) {
        errorDialogService.open({
          message: getApiErrorMessage(error),
          code: getApiErrorCode(error),
        });
      }

      return throwError(() => error);
    }),
  );
};
