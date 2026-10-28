import { getApps, initializeApp } from 'firebase-admin/app';
import { getStorage } from 'firebase-admin/storage';
import { HttpsError, onCall } from 'firebase-functions/v2/https';
import { onSchedule } from 'firebase-functions/v2/scheduler';
import { getPool, queryRows, withTransaction } from './db.js';

if (getApps().length === 0) {
  initializeApp();
}

const storage = getStorage();

export const syncUserProfile = onCall(async (request) => {
  const uid = requireAuth(request.auth?.uid);
  const input = request.data as {
    name?: string;
    email?: string;
    rollNo?: string;
    department?: string;
    year?: string;
    phone?: string;
    bio?: string;
    photoUrl?: string;
  };

  if (!input.email?.trim()) {
    throw new HttpsError('invalid-argument', 'An email address is required.');
  }

  await getPool().query(
    `INSERT INTO users (uid, name, email, roll_no, department, year, phone, bio, photo_url)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
     ON CONFLICT (uid) DO UPDATE SET
       name = EXCLUDED.name,
       email = EXCLUDED.email,
       roll_no = COALESCE(EXCLUDED.roll_no, users.roll_no),
       department = COALESCE(EXCLUDED.department, users.department),
       year = COALESCE(EXCLUDED.year, users.year),
       phone = COALESCE(EXCLUDED.phone, users.phone),
       bio = COALESCE(EXCLUDED.bio, users.bio),
       photo_url = COALESCE(EXCLUDED.photo_url, users.photo_url)`,
    [uid, input.name?.trim() || 'Campus Channels member', input.email.trim(), input.rollNo?.trim() || null,
      input.department?.trim() || null, input.year?.trim() || null, input.phone?.trim() || null,
      input.bio?.trim() || null, input.photoUrl?.trim() || null],
  );
  return { ok: true };
});

export const hasApprovedCommunity = onCall(async (request) => {
  const uid = requireAuth(request.auth?.uid);
  const rows = await queryRows<{ exists: boolean }>(
    `SELECT EXISTS (
       SELECT 1 FROM community_members
       WHERE uid = $1 AND status = 'approved'
     ) AS exists`,
    [uid],
  );
  return { hasCommunity: rows[0]?.exists === true };
});

export const validateAndJoinCommunity = onCall(async (request) => {
  const uid = requireAuth(request.auth?.uid);
  const { inviteCode, communityId } = request.data as { inviteCode?: string; communityId?: string };
  if (!inviteCode || !communityId) {
    throw new HttpsError('invalid-argument', 'inviteCode and communityId are required.');
  }

  await withTransaction(async (client) => {
    const inviteResult = await client.query(
      `SELECT community_id, code, expires_at, max_uses, used_count, active
       FROM invites
       WHERE community_id = $1 AND code = $2
       FOR UPDATE`,
      [communityId, inviteCode.trim().toUpperCase()],
    );
    const invite = inviteResult.rows[0];
    if (!invite) {
      throw new HttpsError('not-found', 'Invite code not found.');
    }
    if (!invite.active || invite.expires_at <= new Date() || invite.used_count >= invite.max_uses) {
      throw new HttpsError('failed-precondition', 'Invite code is expired, inactive, or fully used.');
    }

    await client.query(
      `INSERT INTO community_members (community_id, uid, role, status, invited_with)
       VALUES ($1, $2, 'member', 'pending', $3)
       ON CONFLICT (community_id, uid) DO UPDATE SET invited_with = EXCLUDED.invited_with`,
      [communityId, uid, invite.code],
    );
    await client.query(
      `UPDATE invites SET used_count = used_count + 1 WHERE community_id = $1 AND code = $2`,
      [communityId, invite.code],
    );
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

  await withTransaction(async (client) => {
    const actorResult = await client.query(
      `SELECT role FROM community_members
       WHERE community_id = $1 AND uid = $2 AND status = 'approved'`,
      [communityId, uid],
    );
    if (!['owner', 'admin'].includes(actorResult.rows[0]?.role)) {
      throw new HttpsError('permission-denied', 'Only owners and admins can process join requests.');
    }

    const targetResult = await client.query(
      `UPDATE community_members
       SET status = $1, joined_at = CASE WHEN $1 = 'approved' THEN NOW() ELSE joined_at END
       WHERE community_id = $2 AND uid = $3 AND status = 'pending'
       RETURNING uid`,
      [action === 'approve' ? 'approved' : 'removed', communityId, targetUid],
    );
    if (targetResult.rowCount !== 1) {
      throw new HttpsError('failed-precondition', 'This join request is no longer pending.');
    }

    if (action === 'approve') {
      await client.query(
        `UPDATE communities SET member_count = member_count + 1 WHERE id = $1`,
        [communityId],
      );
    }
  });

  return { status: action === 'approve' ? 'approved' : 'rejected' };
});

export const cleanOrphanedStorage = onSchedule('0 3 * * *', async () => {
  const bucket = storage.bucket();
  const [files] = await bucket.getFiles({ prefix: 'communities/' });
  await Promise.all(files.map(async (file) => {
    if (!file.name.endsWith('.pdf') && !file.metadata.contentType?.startsWith('image/')) {
      return;
    }
    const result = await getPool().query('SELECT 1 FROM papers WHERE storage_path = $1 LIMIT 1', [file.name]);
    if (result.rowCount === 0) {
      await file.delete();
    }
  }));
});

function requireAuth(uid: string | undefined): string {
  if (!uid) {
    throw new HttpsError('unauthenticated', 'You must be signed in.');
  }
  return uid;
}
