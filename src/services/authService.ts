import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { getFirebaseAuth } from '../config/firebase';

export async function loginWithEmail(email: string, password: string): Promise<void> {
  await signInWithEmailAndPassword(getFirebaseAuth(), email.trim(), password);
}

export async function logout(): Promise<void> {
  await signOut(getFirebaseAuth());
}
