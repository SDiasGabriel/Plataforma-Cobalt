import { HttpErrorResponse } from '@angular/common/http';
import { TimeoutError } from 'rxjs';

type ApiErrorBody = {
  message?: string;
  mensagem?: string;
  codigo?: string;
  campos?: unknown;
  error?: string;
  title?: string;
  detail?: string;
  errors?: Record<string, string[]>;
};

export function getApiErrorMessage(error: unknown, fallback = 'Ocorreu um erro inesperado.'): string {
  if (error instanceof TimeoutError) {
    return 'A API demorou para responder. Tente novamente em alguns instantes.';
  }

  if (error instanceof HttpErrorResponse && error.status === 0) {
    return 'Não foi possível conectar com a API. Verifique se ela está rodando e se o CORS/certificado local está configurado.';
  }

  const body = getErrorBody(error);

  if (typeof body === 'string') {
    return body.trim() || fallback;
  }

  if (!body) {
    return fallback;
  }

  if (body.mensagem) {
    return body.mensagem;
  }

  if (body.message) {
    return body.message;
  }

  if (body.error) {
    return body.error;
  }

  if (body.detail) {
    return body.detail;
  }

  const validationMessage = getValidationMessage(body.errors);
  if (validationMessage) {
    return validationMessage;
  }

  if (body.title) {
    return body.title;
  }

  return fallback;
}

export function getApiErrorCode(error: unknown): string {
  const body = getErrorBody(error);

  if (!body || typeof body === 'string') {
    return '';
  }

  return body.codigo ?? '';
}

function getErrorBody(error: unknown): ApiErrorBody | string | null {
  if (error instanceof HttpErrorResponse) {
    return error.error as ApiErrorBody | string | null;
  }

  if (typeof error === 'string' || isApiErrorBody(error)) {
    return error;
  }

  return null;
}

function isApiErrorBody(error: unknown): error is ApiErrorBody {
  return typeof error === 'object' && error !== null;
}

function getValidationMessage(errors?: Record<string, string[]>): string {
  if (!errors) {
    return '';
  }

  const firstError = Object.values(errors).flat().find(Boolean);
  return firstError ?? '';
}
