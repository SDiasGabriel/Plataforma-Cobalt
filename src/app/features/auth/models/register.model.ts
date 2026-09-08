export interface Register {
  apelido: string;
  nome: string;
  Cpf: string;
  telefone: string;
  email: string;
  senha: string;
  documento: File;
  StatusDocumento?: number;
  versaoTermos: string;
}

export interface RegisterResponse {
  mensagem?: string;
  codigo?: string;
  campos?: unknown;
}
