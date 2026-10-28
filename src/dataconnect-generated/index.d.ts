import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, ExecuteQueryOptions, MutationRef, MutationPromise } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;




export interface Channel_Key {
  id: UUIDString;
  __typename?: 'Channel_Key';
}

export interface Community_Key {
  id: UUIDString;
  __typename?: 'Community_Key';
}

export interface CreateCommunityData {
  community_insert: Community_Key;
}

export interface CreateCommunityVariables {
  ownerId: UUIDString;
  email: string;
  name: string;
  description?: string | null;
}

export interface CreateUserData {
  user_insert: User_Key;
}

export interface CreateUserVariables {
  name: string;
  email: string;
  rollNo: string;
  department: string;
  year: number;
  phone?: string | null;
  bio?: string | null;
  photoUrl?: string | null;
}

export interface GetMyCommunitiesData {
  communities: ({
    id: UUIDString;
    name: string;
    description?: string | null;
    postingPolicy: string;
    memberCount?: number | null;
    createdAt: TimestampString;
  } & Community_Key)[];
}

export interface GetMyCommunitiesVariables {
  email: string;
}

export interface GetUserByEmailData {
  users: ({
    id: UUIDString;
    name: string;
    email: string;
    rollNo: string;
    department: string;
    year: number;
    phone?: string | null;
    bio?: string | null;
    photoUrl?: string | null;
    communityIds?: string[] | null;
  } & User_Key)[];
}

export interface GetUserByEmailVariables {
  email: string;
}

export interface HasApprovedCommunityByEmailData {
  memberships: ({
    id: UUIDString;
  } & Membership_Key)[];
}

export interface HasApprovedCommunityByEmailVariables {
  email: string;
}

export interface Invite_Key {
  id: UUIDString;
  __typename?: 'Invite_Key';
}

export interface Membership_Key {
  id: UUIDString;
  __typename?: 'Membership_Key';
}

export interface Paper_Key {
  id: UUIDString;
  __typename?: 'Paper_Key';
}

export interface UpdateUserByEmailData {
  user_update?: User_Key | null;
}

export interface UpdateUserByEmailVariables {
  id: UUIDString;
  email: string;
  name: string;
  rollNo: string;
  department: string;
  year: number;
  phone?: string | null;
  bio?: string | null;
  photoUrl?: string | null;
}

export interface User_Key {
  id: UUIDString;
  __typename?: 'User_Key';
}

interface GetUserByEmailRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetUserByEmailVariables): QueryRef<GetUserByEmailData, GetUserByEmailVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetUserByEmailVariables): QueryRef<GetUserByEmailData, GetUserByEmailVariables>;
  operationName: string;
}
export const getUserByEmailRef: GetUserByEmailRef;

export function getUserByEmail(vars: GetUserByEmailVariables, options?: ExecuteQueryOptions): QueryPromise<GetUserByEmailData, GetUserByEmailVariables>;
export function getUserByEmail(dc: DataConnect, vars: GetUserByEmailVariables, options?: ExecuteQueryOptions): QueryPromise<GetUserByEmailData, GetUserByEmailVariables>;

interface HasApprovedCommunityByEmailRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: HasApprovedCommunityByEmailVariables): QueryRef<HasApprovedCommunityByEmailData, HasApprovedCommunityByEmailVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: HasApprovedCommunityByEmailVariables): QueryRef<HasApprovedCommunityByEmailData, HasApprovedCommunityByEmailVariables>;
  operationName: string;
}
export const hasApprovedCommunityByEmailRef: HasApprovedCommunityByEmailRef;

export function hasApprovedCommunityByEmail(vars: HasApprovedCommunityByEmailVariables, options?: ExecuteQueryOptions): QueryPromise<HasApprovedCommunityByEmailData, HasApprovedCommunityByEmailVariables>;
export function hasApprovedCommunityByEmail(dc: DataConnect, vars: HasApprovedCommunityByEmailVariables, options?: ExecuteQueryOptions): QueryPromise<HasApprovedCommunityByEmailData, HasApprovedCommunityByEmailVariables>;

interface CreateUserRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateUserVariables): MutationRef<CreateUserData, CreateUserVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateUserVariables): MutationRef<CreateUserData, CreateUserVariables>;
  operationName: string;
}
export const createUserRef: CreateUserRef;

export function createUser(vars: CreateUserVariables): MutationPromise<CreateUserData, CreateUserVariables>;
export function createUser(dc: DataConnect, vars: CreateUserVariables): MutationPromise<CreateUserData, CreateUserVariables>;

interface UpdateUserByEmailRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateUserByEmailVariables): MutationRef<UpdateUserByEmailData, UpdateUserByEmailVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateUserByEmailVariables): MutationRef<UpdateUserByEmailData, UpdateUserByEmailVariables>;
  operationName: string;
}
export const updateUserByEmailRef: UpdateUserByEmailRef;

export function updateUserByEmail(vars: UpdateUserByEmailVariables): MutationPromise<UpdateUserByEmailData, UpdateUserByEmailVariables>;
export function updateUserByEmail(dc: DataConnect, vars: UpdateUserByEmailVariables): MutationPromise<UpdateUserByEmailData, UpdateUserByEmailVariables>;

interface GetMyCommunitiesRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetMyCommunitiesVariables): QueryRef<GetMyCommunitiesData, GetMyCommunitiesVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetMyCommunitiesVariables): QueryRef<GetMyCommunitiesData, GetMyCommunitiesVariables>;
  operationName: string;
}
export const getMyCommunitiesRef: GetMyCommunitiesRef;

export function getMyCommunities(vars: GetMyCommunitiesVariables, options?: ExecuteQueryOptions): QueryPromise<GetMyCommunitiesData, GetMyCommunitiesVariables>;
export function getMyCommunities(dc: DataConnect, vars: GetMyCommunitiesVariables, options?: ExecuteQueryOptions): QueryPromise<GetMyCommunitiesData, GetMyCommunitiesVariables>;

interface CreateCommunityRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateCommunityVariables): MutationRef<CreateCommunityData, CreateCommunityVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateCommunityVariables): MutationRef<CreateCommunityData, CreateCommunityVariables>;
  operationName: string;
}
export const createCommunityRef: CreateCommunityRef;

export function createCommunity(vars: CreateCommunityVariables): MutationPromise<CreateCommunityData, CreateCommunityVariables>;
export function createCommunity(dc: DataConnect, vars: CreateCommunityVariables): MutationPromise<CreateCommunityData, CreateCommunityVariables>;

