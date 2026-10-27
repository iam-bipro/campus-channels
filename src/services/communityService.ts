import {
  doc,
  increment,
  runTransaction,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import type { CommunityRole, Invite } from '../types/models';

export async function redeemInviteCode(
  communityId: string,
  code: string,
  uid: string,
): Promise<void> {
  const inviteRef = doc(db, 'communities', communityId, 'invites', code);
  const memberRef = doc(db, 'communities', communityId, 'members', uid);

  await runTransaction(db, async (transaction) => {
    const inviteSnapshot = await transaction.get(inviteRef);
    if (!inviteSnapshot.exists()) {
      throw new Error('Invite code not found.');
    }

    const invite = inviteSnapshot.data() as Invite;
    const expired = invite.expiresAt.toMillis() <= Date.now();
    if (!invite.active || expired || invite.usedCount >= invite.maxUses) {
      throw new Error('Invite code is expired, inactive, or fully used.');
    }

    transaction.set(memberRef, {
      role: 'member' satisfies CommunityRole,
      status: 'pending',
      joinedAt: serverTimestamp(),
      invitedWith: code,
    }, { merge: true });
    transaction.update(inviteRef, { usedCount: increment(1) });
  });
}
