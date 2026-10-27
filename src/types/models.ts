import type { Timestamp } from 'firebase/firestore';

export type CommunityRole = 'owner' | 'admin' | 'moderator' | 'member';
export type MemberStatus = 'pending' | 'approved' | 'removed';

export interface Paper {
  id: string;
  title: string;
  subject: string;
  department: string;
  semester: string;
  examType: string;
  fileUrl: string;
  fileType: 'pdf' | 'image';
  uploadedBy: string;
  createdAt: Timestamp;
  reactions: Record<string, string[]>;
  seenBy: string[];
  seenCount: number;
}

export interface Invite {
  createdBy: string;
  expiresAt: Timestamp;
  maxUses: number;
  usedCount: number;
  active: boolean;
}
