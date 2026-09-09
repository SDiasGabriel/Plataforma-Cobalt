import { HttpClient, HttpContext, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, timeout } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { SKIP_ERROR_DIALOG } from '../../../core/http/http-context-tokens';
import { Cnae } from '../models/cnae.model';

type CnaeApiResponse = Cnae | Cnae[] | {
  campos?: unknown;
  dados?: unknown;
  data?: unknown;
  itens?: unknown;
  items?: unknown;
  resultado?: unknown;
  resultados?: unknown;
};

@Injectable({
  providedIn: 'root',
})
export class CnaeService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private readonly http: HttpClient) {}

  searchByDescriptionOrCode(term: string): Observable<Cnae[]> {
    const params = new HttpParams().set('filtro', term);

    return this.http
      .get<CnaeApiResponse>(`${this.apiUrl}/api/Cnae/BuscarPorDescricaoOuCodigo`, {
        params,
        context: new HttpContext().set(SKIP_ERROR_DIALOG, true),
      })
      .pipe(
        timeout(150000),
        map((response) => this.normalizeResponse(response)),
      );
  }

  private normalizeResponse(response: CnaeApiResponse): Cnae[] {
    if (Array.isArray(response)) {
      return response.map((item) => this.normalizeCnae(item));
    }

    const responseRecord = this.toRecord(response);
    const collection = responseRecord['campos']
      ?? responseRecord['dados']
      ?? responseRecord['data']
      ?? responseRecord['itens']
      ?? responseRecord['items']
      ?? responseRecord['resultado']
      ?? responseRecord['resultados'];

    if (Array.isArray(collection)) {
      return collection.map((item) => this.normalizeCnae(item)).filter((cnae) => cnae.codigo || cnae.descricao);
    }

    return [this.normalizeCnae(response)];
  }

  private normalizeCnae(cnae: unknown): Cnae {
    const cnaeRecord = this.toRecord(cnae);

    return {
      id: Number(cnaeRecord['id'] ?? cnaeRecord['Id']) || undefined,
      codigo: String(
        cnaeRecord['codigo']
        ?? cnaeRecord['Codigo']
        ?? cnaeRecord['codigoCnae']
        ?? cnaeRecord['CodigoCnae']
        ?? '',
      ),
      descricao: String(
        cnaeRecord['descricao']
        ?? cnaeRecord['Descricao']
        ?? cnaeRecord['nome']
        ?? cnaeRecord['Nome']
        ?? cnaeRecord['atividade']
        ?? cnaeRecord['Atividade']
        ?? '',
      ),
    };
  }

  private toRecord(value: unknown): Record<string, unknown> {
    return typeof value === 'object' && value !== null ? value as Record<string, unknown> : {};
  }
}
