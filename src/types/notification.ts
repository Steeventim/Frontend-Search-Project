export interface Notification {
  id: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  createdAt: string;
  userId: string;
  documentId?: string;
  etapeId?: string;
  metadata?: {
    documentTitle?: string;
    senderName?: string;
    etapeName?: string;
    [key: string]: string | number | boolean | undefined;
  };
}

export interface NotificationResponse {
  success: boolean;
  data: Notification[];
  count?: number;
  message?: string;
}

export interface UnreadNotificationResponse {
  success: boolean;
  count: number;
  data: Notification[];
}

export interface NotificationActionResponse {
  success: boolean;
  message: string;
  updated?: number;
}

export interface NotificationStats {
  total: number;
  unread: number;
  byType: Record<string, number>;
}

export interface NotificationFilter {
  type?: string;
  isRead?: boolean;
  startDate?: string;
  endDate?: string;
  limit?: number;
  offset?: number;
}

export type NotificationType = 
  | 'document_received'
  | 'document_pending' 
  | 'document_approved'
  | 'document_rejected'
  | 'etape_assigned'
  | 'system';

export const NOTIFICATION_TYPES: Record<NotificationType, { label: string; color: string; icon: string }> = {
  document_received: {
    label: 'Document reçu',
    color: 'blue',
    icon: 'FileText'
  },
  document_pending: {
    label: 'Document en attente',
    color: 'yellow',
    icon: 'Clock'
  },
  document_approved: {
    label: 'Document approuvé',
    color: 'green',
    icon: 'CheckCircle'
  },
  document_rejected: {
    label: 'Document rejeté',
    color: 'red',
    icon: 'XCircle'
  },
  etape_assigned: {
    label: 'Étape assignée',
    color: 'purple',
    icon: 'ArrowRight'
  },
  system: {
    label: 'Système',
    color: 'gray',
    icon: 'Settings'
  }
};
