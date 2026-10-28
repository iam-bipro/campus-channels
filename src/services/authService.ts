import {
  createUserWithEmailAndPassword,
  deleteUser,
  GoogleAuthProvider,
  browserLocalPersistence,
  sendEmailVerification,
  setPersistence,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { hasApprovedCommunityFromDataConnect, syncUserProfileFromDataConnect } from './dataConnectService';
import { getFirebaseAuth } from '../config/firebase';

export async function loginWithEmail(email: string, password: string): Promise<void> {
  const credential = await signInWithEmailAndPassword(getFirebaseAuth(), email.trim(), password);
  if (!credential.user.emailVerified) {
    await sendEmailVerification(credential.user);
    await signOut(getFirebaseAuth());
    throw new Error('Please verify your email using the link we sent before logging in.');
  }
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
  const email = input.email.trim().toLowerCase();
  const credential = await createUserWithEmailAndPassword(getFirebaseAuth(), email, input.password);

  try {
    await updateProfile(credential.user, { displayName: input.name.trim() });
    await syncUserProfile({ ...input, email });
    await sendEmailVerification(credential.user);
  } catch (error) {
    await deleteUser(credential.user).catch(() => undefined);
    await signOut(getFirebaseAuth());
    throw error;
  }

}

export async function loginWithGoogle(): Promise<void> {
  if (typeof window === 'undefined') {
    throw new Error('Google sign-in is currently configured for the web app. Add native OAuth configuration before using it on mobile.');
  }

  const auth = getFirebaseAuth();
  await setPersistence(auth, browserLocalPersistence);
  const credential = await signInWithPopup(auth, new GoogleAuthProvider());
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
  await syncUserProfileFromDataConnect(input);
}

export async function hasApprovedCommunity(): Promise<boolean> {
  return hasApprovedCommunityFromDataConnect();
}

export async function logout(): Promise<void> {
  await signOut(getFirebaseAuth());
}

export async function updateAuthDisplayName(name: string): Promise<void> {
  const user = getFirebaseAuth().currentUser;
  if (!user) throw new Error('Your session has expired. Please log in again.');
  await updateProfile(user, { displayName: name.trim() });
}

export async function resendVerificationEmail(): Promise<void> {
  const user = getFirebaseAuth().currentUser;
  if (!user) {
    throw new Error('Your signup session has expired. Please log in or create the account again.');
  }
  await sendEmailVerification(user);
}

function validateCollegeEmail(email: string): void {
  const normalizedEmail = email.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
    throw new Error('Enter a valid email address containing @ and a domain.');
  }

  const allowedDomain = process.env.EXPO_PUBLIC_ALLOWED_EMAIL_DOMAIN?.trim().toLowerCase();
  if (allowedDomain && !normalizedEmail.endsWith(`@${allowedDomain}`)) {
    throw new Error(`Use your ${allowedDomain} college email address.`);
  }
}
