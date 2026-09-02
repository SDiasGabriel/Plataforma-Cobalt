import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, timeout } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CurrentUser } from './current-user.model';

type CurrentUserApi = CurrentUser & {
  Codigo?: number;
  Apelido?: string;
  Nome?: string;
  Telefone?: string;
  Status?: boolean;
  Acesso?: number;
  DataCadastro?: string;
  DataAlteracao?: string;
  idUsuario?: string;
  apelidoUsuario?: string;
  nomeUsuario?: string;
};

type CurrentUserResponse = CurrentUserApi & {
  dados?: CurrentUserApi;
  data?: CurrentUserApi;
};

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private readonly http: HttpClient) {}

  getCurrentUser(): Observable<CurrentUser> {
    return this.http
      .get<CurrentUserResponse>(`${this.apiUrl}/api/Usuario/Consultar`)
      .pipe(
        timeout(150000),
        map((response) => this.normalizeCurrentUser(response)),
      );
  }

  private normalizeCurrentUser(response: CurrentUserResponse): CurrentUser {
    const user = response.dados ?? response.data ?? response;

    return {
      codigo: user.codigo ?? user.Codigo ?? response.codigo ?? response.Codigo,
      apelido: user.apelido ?? user.Apelido ?? response.apelido ?? response.Apelido,
      nome: user.nome ?? user.Nome ?? response.nome ?? response.Nome,
      telefone: user.telefone ?? user.Telefone ?? response.telefone ?? response.Telefone,
      status: user.status ?? user.Status ?? response.status ?? response.Status,
      acesso: user.acesso ?? user.Acesso ?? response.acesso ?? response.Acesso,
      dataCadastro:
        user.dataCadastro ?? user.DataCadastro ?? response.dataCadastro ?? response.DataCadastro,
      dataAlteracao:
        user.dataAlteracao ?? user.DataAlteracao ?? response.dataAlteracao ?? response.DataAlteracao,
    };
  }
}
