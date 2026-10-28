CREATE TABLE IF NOT EXISTS users (
  uid TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  roll_no TEXT,
  department TEXT,
  year TEXT,
  phone TEXT,
  bio TEXT,
  photo_url TEXT,
  push_token TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS communities (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  owner_id TEXT NOT NULL REFERENCES users(uid),
  posting_policy TEXT NOT NULL DEFAULT 'admins_only'
    CHECK (posting_policy IN ('admins_only', 'all_members')),
  member_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS community_members (
  community_id UUID NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
  uid TEXT NOT NULL REFERENCES users(uid) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member'
    CHECK (role IN ('owner', 'admin', 'moderator', 'member')),
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'approved', 'removed')),
  joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  invited_with TEXT,
  muted_channels UUID[] NOT NULL DEFAULT '{}',
  quiet_hours JSONB,
  PRIMARY KEY (community_id, uid)
);

CREATE TABLE IF NOT EXISTS invites (
  community_id UUID NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  created_by TEXT NOT NULL REFERENCES users(uid),
  expires_at TIMESTAMPTZ NOT NULL,
  max_uses INTEGER NOT NULL CHECK (max_uses > 0),
  used_count INTEGER NOT NULL DEFAULT 0 CHECK (used_count >= 0),
  active BOOLEAN NOT NULL DEFAULT TRUE,
  PRIMARY KEY (community_id, code)
);

CREATE TABLE IF NOT EXISTS channels (
  id UUID PRIMARY KEY,
  community_id UUID NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT,
  department TEXT,
  archived BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS papers (
  id UUID PRIMARY KEY,
  channel_id UUID NOT NULL REFERENCES channels(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  subject TEXT,
  department TEXT,
  semester TEXT,
  exam_type TEXT,
  file_url TEXT NOT NULL,
  storage_path TEXT NOT NULL UNIQUE,
  file_type TEXT NOT NULL CHECK (file_type IN ('pdf', 'image')),
  uploaded_by TEXT NOT NULL REFERENCES users(uid),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  seen_by TEXT[] NOT NULL DEFAULT '{}',
  seen_count INTEGER NOT NULL DEFAULT 0,
  reactions JSONB NOT NULL DEFAULT '{}'::JSONB
);

CREATE INDEX IF NOT EXISTS community_members_status_joined_idx
  ON community_members (status, joined_at DESC);
CREATE INDEX IF NOT EXISTS invites_active_expiry_idx
  ON invites (active, expires_at);
CREATE INDEX IF NOT EXISTS papers_filter_idx
  ON papers (department, semester, created_at DESC);
CREATE INDEX IF NOT EXISTS papers_exam_idx
  ON papers (exam_type, created_at DESC);
