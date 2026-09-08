import { Component, inject } from '@angular/core';
import { UserSessionService } from '../../../../core/user/user-session.service';
import { SHARED_IMPORTS } from '../../../../shared/shared-imports/shared';
import {
  DASHBOARD_STATUS_CONFIG,
  DASHBOARD_STATUS_BY_DOCUMENT_STATUS,
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
    return DASHBOARD_STATUS_CONFIG[this.statusKey];
  }

  get statusKey(): DashboardStatusKey {
    const user = this.userSessionService.currentUser();

    return DASHBOARD_STATUS_BY_DOCUMENT_STATUS[user?.statusDocumento ?? 0] ?? 'created';
  }

}
