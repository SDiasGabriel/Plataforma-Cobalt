import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ErrorDialogService } from '../services/error-dialog.service';
import { getApiErrorCode, getApiErrorMessage } from './api-error';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const errorDialogService = inject(ErrorDialogService);

  return next(req).pipe(
    catchError((error) => {
      errorDialogService.open({
        message: getApiErrorMessage(error),
        code: getApiErrorCode(error),
      });

      return throwError(() => error);
    }),
  );
};
