-- Cloudflare D1 Database Schema for Animation Studio Workspace
-- Run with: wrangler d1 execute animation-studio-db --file=./schema.sql

CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE,
  synopsis TEXT,
  fps INTEGER DEFAULT 24,
  aspect_ratio TEXT DEFAULT '16:9',
  resolution TEXT DEFAULT '4K (3840x2160)',
  status TEXT DEFAULT 'Production',
  deadline TEXT,
  created_by TEXT DEFAULT 'maltea',
  created_by_name TEXT DEFAULT 'Maltea',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS team_members (
  id TEXT PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL DEFAULT '12345',
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  avatar TEXT,
  email TEXT,
  status TEXT DEFAULT 'online',
  current_task TEXT
);

CREATE TABLE IF NOT EXISTS script_scenes (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL,
  scene_number INTEGER NOT NULL,
  slugline TEXT NOT NULL, -- e.g. "EXT. CLOCKWORK FOREST - DUSK"
  synopsis TEXT,
  content_markdown TEXT NOT NULL,
  page_count REAL DEFAULT 1.0,
  estimated_duration_sec INTEGER DEFAULT 45,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS storyboard_frames (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL,
  scene_id TEXT,
  shot_number TEXT NOT NULL, -- e.g. "01A", "01B"
  image_url TEXT NOT NULL,
  camera_movement TEXT, -- 'Pan Left', 'Slow Dolly In', 'Static Wide', 'Tracking'
  shot_type TEXT, -- 'Extreme Wide', 'Medium Shot', 'Close Up', 'Dutch Angle'
  duration_frames INTEGER DEFAULT 72,
  dialogue TEXT,
  action_description TEXT,
  audio_notes TEXT,
  sequence_order INTEGER NOT NULL,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS shots (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL,
  scene_id TEXT,
  code TEXT NOT NULL, -- e.g. "SC01_SH03"
  title TEXT NOT NULL,
  stage TEXT DEFAULT 'Layout', -- 'Script' | 'Layout' | 'Keyframe' | 'InBetween' | 'Color' | 'Compositing' | 'Approved'
  priority TEXT DEFAULT 'Medium', -- 'Low' | 'Medium' | 'High' | 'Critical'
  assigned_to TEXT,
  start_frame INTEGER DEFAULT 1,
  end_frame INTEGER DEFAULT 120,
  duration_sec REAL DEFAULT 5.0,
  thumbnail_url TEXT,
  notes TEXT,
  complexity TEXT DEFAULT 'Normal', -- 'Simple' | 'Normal' | 'Complex' | 'Hero'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  FOREIGN KEY (assigned_to) REFERENCES team_members(id)
);

CREATE TABLE IF NOT EXISTS audio_takes (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL,
  shot_id TEXT,
  character_name TEXT NOT NULL,
  voice_actor TEXT,
  line_text TEXT NOT NULL,
  take_number INTEGER DEFAULT 1,
  audio_url TEXT NOT NULL,
  duration_sec REAL DEFAULT 3.2,
  waveform_data TEXT, -- JSON array of amplitude points
  is_selected BOOLEAN DEFAULT 0,
  rating INTEGER DEFAULT 4, -- 1 to 5 stars
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS renders (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL,
  shot_id TEXT,
  version TEXT NOT NULL, -- e.g. "v03"
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  status TEXT DEFAULT 'Completed', -- 'Rendering' | 'Completed' | 'Failed' | 'In Review'
  render_engine TEXT DEFAULT 'Blender Cycles / ToonShade',
  duration_sec REAL DEFAULT 8.5,
  resolution TEXT DEFAULT '3840x2160',
  fps INTEGER DEFAULT 24,
  file_size_mb REAL DEFAULT 142.5,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS render_feedback (
  id TEXT PRIMARY KEY,
  render_id TEXT NOT NULL,
  author_id TEXT NOT NULL,
  timecode_sec REAL NOT NULL, -- e.g. 3.4
  comment TEXT NOT NULL,
  is_resolved BOOLEAN DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (render_id) REFERENCES renders(id) ON DELETE CASCADE,
  FOREIGN KEY (author_id) REFERENCES team_members(id)
);

CREATE TABLE IF NOT EXISTS chat_messages (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL,
  author_id TEXT NOT NULL,
  message TEXT NOT NULL,
  attachment_url TEXT,
  shot_ref_id TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  FOREIGN KEY (author_id) REFERENCES team_members(id)
);

CREATE TABLE IF NOT EXISTS scene_comments (
  id TEXT PRIMARY KEY,
  scene_id TEXT NOT NULL,
  author_id TEXT NOT NULL,
  comment TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (scene_id) REFERENCES script_scenes(id) ON DELETE CASCADE,
  FOREIGN KEY (author_id) REFERENCES team_members(id)
);

-- Delete all old users from database
DELETE FROM team_members;

-- Insert 3 authorized studio artists (maltea, valtea, biaktea)
INSERT OR REPLACE INTO team_members (id, username, password, name, role, avatar, email, status, current_task) VALUES
('maltea', 'maltea', '12345', 'Maltea', 'Director & Showrunner', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', 'maltea@aurastudios.com', 'online', 'Screenplay Directing & Final Cut Approval'),
('valtea', 'valtea', '12345', 'Valtea', 'Lead Animator', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', 'valtea@aurastudios.com', 'online', 'Keyframing & Motion Review'),
('biaktea', 'biaktea', '12345', 'Biaktea', 'Storyboard & Art Lead', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80', 'biaktea@aurastudios.com', 'online', 'Script Breakdown & Storyboard Framing');

