import { getDataConnect } from 'firebase/data-connect';
import {
  createUser,
  connectorConfig,
  getUserByEmail,
  getMyCommunities,
  hasApprovedCommunityByEmail as runHasApprovedCommunityByEmail,
  createCommunity,
  updateUserByEmail,
} from '../dataconnect-generated';
import { getFirebaseAuth } from '../config/firebase';

const dataConnect = getDataConnect(connectorConfig);

export type UserProfile = {
  id: string;
  name: string;
  email: string;
  rollNo: string;
  department: string;
  year: number;
  phone?: string | null;
  bio?: string | null;
  photoUrl?: string | null;
};

export type CommunitySummary = {
  id: string;
  name: string;
  description?: string | null;
  postingPolicy: string;
  memberCount?: number | null;
  createdAt: string;
};

export async function syncUserProfileFromDataConnect(input: {
  name: string;
  email: string;
  rollNo?: string;
  department?: string;
  year?: string;
  phone?: string;
  bio?: string;
  photoUrl?: string;
}): Promise<void> {
  await createUser(dataConnect, {
    name: input.name.trim() || 'Campus Channels member',
    email: input.email.trim(),
    rollNo: input.rollNo?.trim() || 'Not provided',
    department: input.department?.trim() || 'Not provided',
    year: Number.parseInt(input.year || '', 10) || 0,
    phone: input.phone?.trim() || undefined,
    bio: input.bio?.trim() || undefined,
    photoUrl: input.photoUrl?.trim() || undefined,
  });
}

export async function hasApprovedCommunityFromDataConnect(): Promise<boolean> {
  const email = getFirebaseAuth().currentUser?.email?.trim();
  if (!email) {
    throw new Error('A signed-in user email is required to check community membership.');
  }

  const result = await runHasApprovedCommunityByEmail(dataConnect, { email });
  return result.data.memberships.length > 0;
}

export async function getCurrentUserProfile(): Promise<UserProfile | null> {
  const email = getFirebaseAuth().currentUser?.email?.trim();
  if (!email) return null;
  const result = await getUserByEmail(dataConnect, { email });
  return result.data.users[0] || null;
}

export async function updateCurrentUserProfile(input: Omit<UserProfile, 'email' | 'id'> & { id: string }): Promise<void> {
  const email = getFirebaseAuth().currentUser?.email?.trim();
  if (!email) throw new Error('A signed-in user email is required to update your profile.');
  await updateUserByEmail(dataConnect, { ...input, email });
}

export async function getMyCommunitiesFromDataConnect(): Promise<CommunitySummary[]> {
  const email = getFirebaseAuth().currentUser?.email?.trim();
  if (!email) throw new Error('A signed-in user email is required to load communities.');
  const result = await getMyCommunities(dataConnect, { email });
  return result.data.communities;
}

export async function createCommunityInDataConnect(input: { name: string; description?: string }): Promise<string> {
  const profile = await getCurrentUserProfile();
  const email = getFirebaseAuth().currentUser?.email?.trim();
  if (!profile || !email) throw new Error('Complete your account profile before creating a community.');
  const result = await createCommunity(dataConnect, {
    ownerId: profile.id,
    email,
    name: input.name.trim(),
    description: input.description?.trim() || undefined,
  });
  return result.data.community_insert.id;
}
