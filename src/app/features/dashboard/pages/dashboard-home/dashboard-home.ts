import { Component } from '@angular/core';
import { CobaltButton } from '../../../../shared/components/cobalt-button/cobalt-button';
import { SHARED_IMPORTS } from '../../../../shared/shared-imports/shared';

@Component({
  selector: 'app-dashboard-home',
  imports: [SHARED_IMPORTS],
  templateUrl: './dashboard-home.html',
  styleUrl: './dashboard-home.scss',
})
export class DashboardHome {}
