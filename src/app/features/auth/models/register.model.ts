export interface Register {
  apelido: string;
  nome: string;
  cpf: string;
  telefone: string;
  email: string;
  senha: string;
  documento: string | null;
  versaoTermos: string;
}

export interface RegisterResponse {
  mensagem?: string;
  codigo?: string;
  campos?: unknown;
}
