import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { httpsCallable } from 'firebase/functions';
import { getFirebaseAuth, functions } from '../config/firebase';

export async function loginWithEmail(email: string, password: string): Promise<void> {
  await signInWithEmailAndPassword(getFirebaseAuth(), email.trim(), password);
}

export async function registerWithEmail(input: {
  name: string;
  email: string;
  password: string;
  rollNo: string;
  department: string;
  year: string;
  phone?: string;
  bio?: string;
}): Promise<void> {
  validateCollegeEmail(input.email);
  const credential = await createUserWithEmailAndPassword(getFirebaseAuth(), input.email.trim(), input.password);
  await updateProfile(credential.user, { displayName: input.name.trim() });
  await syncUserProfile(input);
}

export async function loginWithGoogle(): Promise<void> {
  if (typeof window === 'undefined') {
    throw new Error('Google sign-in is currently configured for the web app. Add native OAuth configuration before using it on mobile.');
  }

  const credential = await signInWithPopup(getFirebaseAuth(), new GoogleAuthProvider());
  await syncUserProfile({
    name: credential.user.displayName || 'Campus Channels member',
    email: credential.user.email || '',
    photoUrl: credential.user.photoURL || undefined,
  });
}

export async function syncUserProfile(input: {
  name: string;
  email: string;
  rollNo?: string;
  department?: string;
  year?: string;
  phone?: string;
  bio?: string;
  photoUrl?: string;
}): Promise<void> {
  const syncProfile = httpsCallable(functions, 'syncUserProfile');
  await syncProfile(input);
}

export async function hasApprovedCommunity(): Promise<boolean> {
  const checkMembership = httpsCallable<unknown, { hasCommunity: boolean }>(functions, 'hasApprovedCommunity');
  const result = await checkMembership({});
  return result.data.hasCommunity;
}

export async function logout(): Promise<void> {
  await signOut(getFirebaseAuth());
}

function validateCollegeEmail(email: string): void {
  const allowedDomain = process.env.EXPO_PUBLIC_ALLOWED_EMAIL_DOMAIN?.trim().toLowerCase();
  if (allowedDomain && !email.trim().toLowerCase().endsWith(`@${allowedDomain}`)) {
    throw new Error(`Use your ${allowedDomain} college email address.`);
  }
}
