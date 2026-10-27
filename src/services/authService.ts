import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { getFirebaseAuth } from '../config/firebase';
import { db } from '../config/firebase';

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
  await setDoc(doc(db, 'users', credential.user.uid), {
    name: input.name.trim(),
    email: input.email.trim(),
    rollNo: input.rollNo.trim(),
    department: input.department.trim(),
    year: input.year.trim(),
    phone: input.phone?.trim() || null,
    bio: input.bio?.trim() || null,
    communityIds: [],
    createdAt: new Date(),
  });
}

export async function loginWithGoogle(): Promise<void> {
  if (typeof window === 'undefined') {
    throw new Error('Google sign-in is currently configured for the web app. Add native OAuth configuration before using it on mobile.');
  }

  const credential = await signInWithPopup(getFirebaseAuth(), new GoogleAuthProvider());
  await setDoc(doc(db, 'users', credential.user.uid), {
    name: credential.user.displayName || 'Campus Channels member',
    email: credential.user.email || '',
    photoUrl: credential.user.photoURL || null,
  }, { merge: true });
}

export async function hasApprovedCommunity(uid: string): Promise<boolean> {
  const snapshot = await getDoc(doc(db, 'users', uid));
  const communityIds = snapshot.data()?.communityIds;
  return Array.isArray(communityIds) && communityIds.length > 0;
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
