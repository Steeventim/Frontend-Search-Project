export interface Notification {
  id: string;
  title: string;
  message: string;
  processId?: string;
  documentId?: string;
  timestamp: string;
  read: boolean;
  type: NotificationType;
  sender?: {
    id: string;
    name: string;
  };
}

export type NotificationType =
  | "process_assigned"
  | "process_approved"
  | "process_rejected"
  | "comment_added"
  | "deadline_approaching"
  | "system";
