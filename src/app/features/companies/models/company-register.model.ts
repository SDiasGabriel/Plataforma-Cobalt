export interface CompanyRegister {
  cnpj: string;
  nomeFantasia: string;
  razaoSocial: string;
  cnae: string;
  perfil: string;
  telefone: string;
  email: string;
}

export interface CompanyRegisterResponse {
  mensagem?: string;
  codigo?: string;
  campos?: unknown;
}
