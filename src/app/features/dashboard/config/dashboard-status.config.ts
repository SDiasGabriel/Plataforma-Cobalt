export type DashboardStatusKey = 'created' | 'documentsSent' | 'analysis' | 'pending' | 'rejected' | 'approved';

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
  documentsSent: {
    processTitle: 'Processo de Onboarding em andamento',
    processDescription: 'Sua documentação foi enviada',
    statusTitle: 'Documentos enviados',
    statusDescription: 'Recebemos seus documentos',
    documentationMessage: 'Seu documento de identificação foi enviado para análise.',
    documentationPendingCount: 0,
  },
  analysis: {
    processTitle: 'Processo de Onboarding em andamento',
    processDescription: 'Sua documentação está em análise',
    statusTitle: 'Em análise',
    statusDescription: 'Estamos avaliando seus documentos',
    documentationMessage: 'Seu documento de identificação está sob análise de nossa equipe.',
    documentationPendingCount: 1,
  },
  pending: {
    processTitle: 'Processo de Onboarding com pendência',
    processDescription: 'Existe uma pendência no seu cadastro',
    statusTitle: 'Pendência',
    statusDescription: 'Revise as informações solicitadas',
    documentationMessage: 'Existe uma pendência na sua documentação.',
    documentationPendingCount: 1,
  },
  rejected: {
    processTitle: 'Processo de Onboarding com documento reprovado',
    processDescription: 'Seu documento precisa ser reenviado',
    statusTitle: 'Documento reprovado',
    statusDescription: 'Envie um novo documento para continuar',
    documentationMessage: 'Seu documento foi reprovado. Envie um novo arquivo para análise.',
    documentationPendingCount: 1,
  },
  approved: {
    processTitle: 'Processo de Onboarding concluído',
    processDescription: 'Seu cadastro foi aprovado',
    statusTitle: 'Aprovado',
    statusDescription: 'Seu cadastro está ativo',
    documentationMessage: 'Sua documentação foi aprovada.',
    documentationPendingCount: 0,
  },
};
