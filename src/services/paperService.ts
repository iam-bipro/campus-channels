import {
  arrayUnion,
  collection,
  doc,
  increment,
  runTransaction,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import type { Paper } from '../types/models';

export async function markPaperSeen(
  communityId: string,
  channelId: string,
  paperId: string,
  uid: string,
): Promise<void> {
  const paperRef = doc(db, 'communities', communityId, 'channels', channelId, 'papers', paperId);

  await runTransaction(db, async (transaction) => {
    const snapshot = await transaction.get(paperRef);
    if (!snapshot.exists()) {
      throw new Error('Paper not found.');
    }

    const paper = snapshot.data() as Partial<Paper>;
    if (paper.seenBy?.includes(uid)) {
      return;
    }

    transaction.update(paperRef, {
      seenBy: arrayUnion(uid),
      seenCount: increment(1),
    });
  });
}

export async function updatePaperReaction(
  paperPath: string,
  reaction: string,
  uid: string,
): Promise<void> {
  await updateDoc(doc(db, paperPath), {
    [`reactions.${reaction}`]: arrayUnion(uid),
    updatedAt: serverTimestamp(),
  });
}
