import {
  onDisconnect,
  onValue,
  ref,
  serverTimestamp,
  set,
} from 'firebase/database';
import { getRealtimeDatabase } from '../config/firebase';

export async function connectPresence(uid: string): Promise<() => void> {
  const realtimeDb = getRealtimeDatabase();
  const presenceRef = ref(realtimeDb, `presence/${uid}`);
  await set(presenceRef, { state: 'online', lastSeen: serverTimestamp() });
  await onDisconnect(presenceRef).set({ state: 'offline', lastSeen: serverTimestamp() });

  return () => {
    void set(presenceRef, { state: 'offline', lastSeen: serverTimestamp() });
  };
}

export function subscribeToPresence(
  uid: string,
  onChange: (presence: { state: 'online' | 'offline'; lastSeen: number | null }) => void,
): () => void {
  const realtimeDb = getRealtimeDatabase();
  return onValue(ref(realtimeDb, `presence/${uid}`), (snapshot) => {
    const value = snapshot.val();
    onChange({
      state: value?.state === 'online' ? 'online' : 'offline',
      lastSeen: typeof value?.lastSeen === 'number' ? value.lastSeen : null,
    });
  });
}
