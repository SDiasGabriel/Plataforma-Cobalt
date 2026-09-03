import { Component, inject } from '@angular/core';
import { UserSessionService } from '../../../../core/user/user-session.service';
import { SHARED_IMPORTS } from '../../../../shared/shared-imports/shared';
import {
  DASHBOARD_STATUS_CONFIG,
  DashboardStatusConfig,
  DashboardStatusKey,
} from '../../config/dashboard-status.config';

@Component({
  selector: 'app-dashboard-home',
  imports: [SHARED_IMPORTS],
  templateUrl: './dashboard-home.html',
  styleUrl: './dashboard-home.scss',
})
export class DashboardHome {
  readonly userSessionService = inject(UserSessionService);

  get statusConfig(): DashboardStatusConfig {
    return DASHBOARD_STATUS_CONFIG[this.getStatusKey()];
  }

  private getStatusKey(): DashboardStatusKey {
    const user = this.userSessionService.currentUser();

    if (user?.status) {
      return 'analysis';
    }

    return 'created';
  }
}
