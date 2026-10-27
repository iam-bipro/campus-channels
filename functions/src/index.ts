import { onDocumentCreated } from 'firebase-functions/v2/firestore';
import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

initializeApp();
const firestore = getFirestore();

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
      .filter((member) => !member.data().mutedChannels?.includes(event.params.channelId))
      .map((member) => member.id);
    const users = await Promise.all(userRefs.map((uid) => firestore.doc(`users/${uid}`).get()));
    const messages = users
      .map((user) => ({ token: user.data()?.pushToken, uid: user.id }))
      .filter((entry): entry is { token: string; uid: string } => typeof entry.token === 'string');

    if (messages.length === 0) {
      return;
    }

    const response = await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(messages.map(({ token }) => ({
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
  },
);
