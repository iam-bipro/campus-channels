import { httpsCallable } from 'firebase/functions';
import { functions } from '../config/firebase';

export async function redeemInviteCode(
  communityId: string,
  code: string,
): Promise<void> {
  const validateAndJoin = httpsCallable(functions, 'validateAndJoinCommunity');
  await validateAndJoin({ communityId, inviteCode: code });
}

export async function processJoinApproval(
  communityId: string,
  targetUid: string,
  action: 'approve' | 'reject',
): Promise<void> {
  const processApproval = httpsCallable(functions, 'processJoinApproval');
  await processApproval({ communityId, targetUid, action });
}
