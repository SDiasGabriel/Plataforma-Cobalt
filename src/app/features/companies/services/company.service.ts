import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, timeout } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { CompanyRegister, CompanyRegisterResponse } from '../models/company-register.model';

@Injectable({
  providedIn: 'root',
})
export class CompanyService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private readonly http: HttpClient) {}

  registerCompany(data: CompanyRegister): Observable<CompanyRegisterResponse> {
    return this.http
      .post<CompanyRegisterResponse>(`${this.apiUrl}/api/Empresa/Inserir`, data)
      .pipe(timeout(150000));
  }
}
