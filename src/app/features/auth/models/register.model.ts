export interface Register {
  apelido: string;
  nome: string;
  telefone: string;
  email: string;
  senha: string;
  documento: string | null;
}

export interface RegisterResponse {
  mensagem?: string;
  codigo?: string;
  campos?: unknown;
}
