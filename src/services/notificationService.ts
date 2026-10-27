import * as Notifications from 'expo-notifications';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

export async function registerPushToken(uid: string): Promise<string | null> {
  const permissions = await Notifications.getPermissionsAsync();
  let status = permissions.status;

  if (status !== 'granted') {
    const requested = await Notifications.requestPermissionsAsync();
    status = requested.status;
  }

  if (status !== 'granted') {
    return null;
  }

  const token = (await Notifications.getExpoPushTokenAsync()).data;
  await setDoc(doc(db, 'users', uid), {
    pushToken: token,
    pushTokenUpdatedAt: serverTimestamp(),
  }, { merge: true });

  return token;
}

// Push delivery is intentionally server-side. Clients only register tokens and preferences.
