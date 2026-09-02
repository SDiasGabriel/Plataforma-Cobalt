import { Component, inject } from '@angular/core';
import { UserSessionService } from '../../../../core/user/user-session.service';
import { SHARED_IMPORTS } from '../../../../shared/shared-imports/shared';

@Component({
  selector: 'app-dashboard-home',
  imports: [SHARED_IMPORTS],
  templateUrl: './dashboard-home.html',
  styleUrl: './dashboard-home.scss',
})
export class DashboardHome {
  readonly userSessionService = inject(UserSessionService);
}
