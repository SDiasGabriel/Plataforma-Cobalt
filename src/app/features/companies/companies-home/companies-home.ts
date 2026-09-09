import { Component } from '@angular/core';
import { CompanyRegisterPanel } from '../company-register-panel/company-register-panel';
import { SHARED_IMPORTS } from '../../../shared/shared-imports/shared';

@Component({
  selector: 'app-companies-home',
  imports: [...SHARED_IMPORTS, CompanyRegisterPanel],
  templateUrl: './companies-home.html',
  styleUrl: './companies-home.scss',
})
export class CompaniesHome {
  isRegisterPanelOpen = false;

  openRegisterPanel(): void {
    this.isRegisterPanelOpen = true;
  }

  closeRegisterPanel(): void {
    this.isRegisterPanelOpen = false;
  }
}
