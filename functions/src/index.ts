import { getApps, initializeApp } from 'firebase-admin/app';
import { FieldValue, getFirestore, Timestamp } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';
import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { onDocumentCreated } from 'firebase-functions/v2/firestore';
import { onSchedule } from 'firebase-functions/v2/scheduler';

if (getApps().length === 0) {
  initializeApp();
}
const firestore = getFirestore();
const storage = getStorage();

export const onPaperCreated = onDocumentCreated(
  'communities/{communityId}/channels/{channelId}/papers/{paperId}',
  async (event) => {
    const paper = event.data?.data();
    if (!paper) {
      return;
    }

    const membersSnapshot = await firestore
      .collection(`communities/${event.params.communityId}/members`)
      .where('status', '==', 'approved')
      .get();
    const userRefs = membersSnapshot.docs
      .filter((member) => {
        const data = member.data();
        return !data.mutedChannels?.includes(event.params.channelId) && !isQuietHours(data.quietHours);
      })
      .map((member) => member.id);
    const users = await Promise.all(userRefs.map((uid) => firestore.doc(`users/${uid}`).get()));
    const messages = users
      .map((user) => ({ token: user.data()?.pushToken, uid: user.id }))
      .filter((entry): entry is { token: string; uid: string } => typeof entry.token === 'string');

    if (messages.length === 0) {
      return;
    }

    for (const batch of chunk(messages, 100)) {
      const response = await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(batch.map(({ token }) => ({
          to: token,
          title: paper.title,
          body: `${paper.subject} · ${paper.semester}`,
          data: {
            communityId: event.params.communityId,
            channelId: event.params.channelId,
            paperId: event.params.paperId,
          },
        }))),
      });

      if (!response.ok) {
        throw new Error(`Expo push gateway returned ${response.status}.`);
      }
    }
  },
);

export const validateAndJoinCommunity = onCall(async (request) => {
  const uid = requireAuth(request.auth?.uid);
  const { inviteCode, communityId } = request.data as { inviteCode?: string; communityId?: string };
  if (!inviteCode || !communityId) {
    throw new HttpsError('invalid-argument', 'inviteCode and communityId are required.');
  }

  const inviteRef = firestore.doc(`communities/${communityId}/invites/${inviteCode.trim().toUpperCase()}`);
  const memberRef = firestore.doc(`communities/${communityId}/members/${uid}`);

  await firestore.runTransaction(async (transaction) => {
    const inviteSnapshot = await transaction.get(inviteRef);
    if (!inviteSnapshot.exists) {
      throw new HttpsError('not-found', 'Invite code not found.');
    }

    const invite = inviteSnapshot.data()!;
    const expiresAt = invite.expiresAt as Timestamp | undefined;
    if (!invite.active || !expiresAt || expiresAt.toMillis() <= Date.now() || invite.usedCount >= invite.maxUses) {
      throw new HttpsError('failed-precondition', 'Invite code is expired, inactive, or fully used.');
    }

    transaction.set(memberRef, {
      uid,
      role: 'member',
      status: 'pending',
      joinedAt: FieldValue.serverTimestamp(),
      invitedWith: inviteCode.trim().toUpperCase(),
    }, { merge: true });
    transaction.update(inviteRef, { usedCount: FieldValue.increment(1) });
  });

  return { status: 'pending' };
});

export const processJoinApproval = onCall(async (request) => {
  const uid = requireAuth(request.auth?.uid);
  const { targetUid, action, communityId } = request.data as {
    targetUid?: string;
    action?: 'approve' | 'reject';
    communityId?: string;
  };
  if (!targetUid || !communityId || !['approve', 'reject'].includes(action || '')) {
    throw new HttpsError('invalid-argument', 'communityId, targetUid, and a valid action are required.');
  }

  const actorRef = firestore.doc(`communities/${communityId}/members/${uid}`);
  const targetRef = firestore.doc(`communities/${communityId}/members/${targetUid}`);
  const communityRef = firestore.doc(`communities/${communityId}`);
  const targetUserRef = firestore.doc(`users/${targetUid}`);

  await firestore.runTransaction(async (transaction) => {
    const actorSnapshot = await transaction.get(actorRef);
    const targetSnapshot = await transaction.get(targetRef);
    if (!actorSnapshot.exists || !['owner', 'admin'].includes(actorSnapshot.data()?.role)) {
      throw new HttpsError('permission-denied', 'Only owners and admins can process join requests.');
    }
    if (!targetSnapshot.exists || targetSnapshot.data()?.status !== 'pending') {
      throw new HttpsError('failed-precondition', 'This join request is no longer pending.');
    }

    if (action === 'approve') {
      transaction.update(targetRef, { status: 'approved', joinedAt: FieldValue.serverTimestamp() });
      transaction.set(communityRef, { memberCount: FieldValue.increment(1) }, { merge: true });
      transaction.set(targetUserRef, { communityIds: FieldValue.arrayUnion(communityId) }, { merge: true });
    } else {
      transaction.update(targetRef, { status: 'removed' });
    }
  });

  return { status: action === 'approve' ? 'approved' : 'rejected' };
});

export const cleanOrphanedStorage = onSchedule('0 3 * * *', async () => {
  const bucket = storage.bucket();
  const [files] = await bucket.getFiles({ prefix: 'communities/' });
  const checks = files
    .filter((file) => file.name.endsWith('.pdf') || file.metadata.contentType?.startsWith('image/'))
    .map(async (file) => {
      const path = file.name.split('/');
      if (path.length < 3 || path[0] !== 'communities') {
        return;
      }

      const paperSnapshot = await firestore
        .collectionGroup('papers')
        .where('storagePath', '==', file.name)
        .limit(1)
        .get();
      if (paperSnapshot.empty) {
        await file.delete();
      }
    });

  await Promise.all(checks);
});

function requireAuth(uid: string | undefined): string {
  if (!uid) {
    throw new HttpsError('unauthenticated', 'You must be signed in.');
  }
  return uid;
}

function isQuietHours(quietHours: { enabled?: boolean; start?: number; end?: number } | undefined): boolean {
  if (!quietHours?.enabled || typeof quietHours.start !== 'number' || typeof quietHours.end !== 'number') {
    return false;
  }
  const hour = new Date().getUTCHours();
  return quietHours.start <= quietHours.end
    ? hour >= quietHours.start && hour < quietHours.end
    : hour >= quietHours.start || hour < quietHours.end;
}

function chunk<T>(items: T[], size: number): T[][] {
  const batches: T[][] = [];
  for (let index = 0; index < items.length; index += size) {
    batches.push(items.slice(index, index + size));
  }
  return batches;
}
