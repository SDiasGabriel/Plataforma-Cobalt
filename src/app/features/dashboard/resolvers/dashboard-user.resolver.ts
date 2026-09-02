import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { catchError, of, tap } from 'rxjs';
import { CurrentUser } from '../../../core/user/current-user.model';
import { UserService } from '../../../core/user/user.service';
import { UserSessionService } from '../../../core/user/user-session.service';

export const dashboardUserResolver: ResolveFn<CurrentUser | null> = () => {
  const userService = inject(UserService);
  const userSessionService = inject(UserSessionService);

  return userService.getCurrentUser().pipe(
    tap((user) => userSessionService.setCurrentUser(user)),
    catchError(() => {
      userSessionService.clear();
      return of(null);
    }),
  );
};
