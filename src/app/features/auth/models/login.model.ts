export interface Login {
  Email: string;
  Senha: string;
}

export interface LoginResponse {
  token: string | null;
  refreshToken: string | null;
  mensagem?: string | null;
  codigo?: string | null;
  campos?: unknown;
}
