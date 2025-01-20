import { Attachment } from './process';

export interface Comment {
  id: string;
  text: string;
  userId: string;
  userName: string;
  timestamp: Date;
  attachments: Attachment[];
}