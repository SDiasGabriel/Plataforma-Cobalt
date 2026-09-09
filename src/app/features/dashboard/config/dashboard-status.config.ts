export type DashboardStatusKey = 'created' | 'analysis' | 'approved' | 'rejected';

export type DashboardStatusConfig = {
  processTitle: string;
  processDescription: string;
  statusTitle: string;
  statusDescription: string;
  documentationMessage: string;
  documentationPendingCount: number;
};

export const DASHBOARD_STATUS_CONFIG: Record<DashboardStatusKey, DashboardStatusConfig> = {
  created: {
    processTitle: 'Processo de Onboarding em andamento',
    processDescription: 'Sua documentação está pendente de envio',
    statusTitle: 'Pendente',
    statusDescription: 'Envie seus documentos para continuar',
    documentationMessage: 'Envie seu documento de identificação para nossa equipe avaliar.',
    documentationPendingCount: 1,
  },
  analysis: {
    processTitle: 'Processo de Onboarding em andamento',
    processDescription: 'Sua documentação está em análise',
    statusTitle: 'Análise Documentos',
    statusDescription: 'Estamos avaliando seus documentos',
    documentationMessage: 'Seu documento de identificação está sob análise de nossa equipe.',
    documentationPendingCount: 1,
  },
  approved: {
    processTitle: 'Processo de Onboarding concluído',
    processDescription: 'Sua documentação foi aceita',
    statusTitle: 'Documentação Aceita',
    statusDescription: 'Seu cadastro está ativo',
    documentationMessage: 'Sua documentação foi aceita.',
    documentationPendingCount: 0,
  },
  rejected: {
    processTitle: 'Processo de Onboarding com documento recusado',
    processDescription: 'Sua documentação foi recusada',
    statusTitle: 'Documento Recusado',
    statusDescription: 'Envie um novo documento para continuar',
    documentationMessage: 'Sua documentação foi recusada. Envie um novo arquivo para análise.',
    documentationPendingCount: 1,
  },
};

export const DASHBOARD_STATUS_BY_DOCUMENT_STATUS: Partial<Record<number, DashboardStatusKey>> = {
  1: 'analysis',
  2: 'approved',
  3: 'rejected',
};
