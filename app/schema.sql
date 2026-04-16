-- ════════════════════════════════════════════════════════════════
-- SAFE-GUARD OPS TERMINAL · SCHEMA
-- Config-driven dashboard. Nothing renders without a config row.
-- ════════════════════════════════════════════════════════════════

-- Drop in correct order for clean re-seeds
DROP TABLE IF EXISTS activity_log CASCADE;
DROP TABLE IF EXISTS team_submissions CASCADE;
DROP TABLE IF EXISTS team_access_tokens CASCADE;
DROP TABLE IF EXISTS checkins CASCADE;
DROP TABLE IF EXISTS commitments CASCADE;
DROP TABLE IF EXISTS comms_queue CASCADE;
DROP TABLE IF EXISTS decisions_pending CASCADE;
DROP TABLE IF EXISTS okrs CASCADE;
DROP TABLE IF EXISTS pace_history CASCADE;
DROP TABLE IF EXISTS initiatives CASCADE;
DROP TABLE IF EXISTS morale_history CASCADE;
DROP TABLE IF EXISTS team_members CASCADE;
DROP TABLE IF EXISTS risks CASCADE;
DROP TABLE IF EXISTS commitments_to_board CASCADE;
DROP TABLE IF EXISTS priorities CASCADE;
DROP TABLE IF EXISTS metric_drivers CASCADE;
DROP TABLE IF EXISTS metric_values CASCADE;
DROP TABLE IF EXISTS metrics_config CASCADE;
DROP TABLE IF EXISTS section_config CASCADE;
DROP TABLE IF EXISTS app_config CASCADE;

-- ════════════════════════════════════════════════════════════════
-- CONFIG LAYER · controls what renders
-- ════════════════════════════════════════════════════════════════

CREATE TABLE app_config (
  key            TEXT PRIMARY KEY,
  value          JSONB NOT NULL,
  updated_at     TIMESTAMPTZ DEFAULT NOW(),
  updated_by     TEXT DEFAULT 'wizard'
);

-- Seed keys: company_name, tabs_enabled, time_horizon_labels,
-- demo_mode_enabled, intake_methods_enabled, vercel_domain

CREATE TABLE section_config (
  id             SERIAL PRIMARY KEY,
  tab            TEXT NOT NULL CHECK (tab IN ('aviate','navigate','communicate')),
  section_key    TEXT NOT NULL,
  label          TEXT NOT NULL,
  enabled        BOOLEAN DEFAULT FALSE,
  display_order  INT DEFAULT 0,
  notes          TEXT,
  UNIQUE(tab, section_key)
);

CREATE TABLE metrics_config (
  key            TEXT PRIMARY KEY,
  label          TEXT NOT NULL,
  scope          TEXT NOT NULL CHECK (scope IN ('REALTIME','LEADING','MTD','QTD','YTD','COMMITMENT')),
  family         TEXT,
  unit           TEXT,
  direction      TEXT DEFAULT 'up' CHECK (direction IN ('up','down')),
  target         NUMERIC,
  enabled        BOOLEAN DEFAULT FALSE,
  display_order  INT DEFAULT 0,
  definition     TEXT,
  source_type    TEXT DEFAULT 'manual' CHECK (source_type IN ('manual','claude','sheets','api','future')),
  source_config  JSONB,
  paired_key     TEXT,
  priority_rank  INT DEFAULT 99,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

-- ════════════════════════════════════════════════════════════════
-- METRIC DATA · values + drivers
-- ════════════════════════════════════════════════════════════════

CREATE TABLE metric_values (
  id             SERIAL PRIMARY KEY,
  metric_key     TEXT NOT NULL REFERENCES metrics_config(key) ON DELETE CASCADE,
  value          NUMERIC NOT NULL,
  value_display  TEXT,
  as_of          TIMESTAMPTZ DEFAULT NOW(),
  source         TEXT DEFAULT 'manual',
  updated_by     TEXT DEFAULT 'wizard',
  notes          TEXT
);
CREATE INDEX idx_metric_values_key_date ON metric_values(metric_key, as_of DESC);

CREATE TABLE metric_drivers (
  id             SERIAL PRIMARY KEY,
  metric_key     TEXT NOT NULL REFERENCES metrics_config(key) ON DELETE CASCADE,
  factor         TEXT NOT NULL,
  impact         NUMERIC NOT NULL,
  unit           TEXT,
  as_of          TIMESTAMPTZ DEFAULT NOW(),
  source         TEXT DEFAULT 'manual'
);

-- ════════════════════════════════════════════════════════════════
-- AVIATE
-- ════════════════════════════════════════════════════════════════

CREATE TABLE priorities (
  id             SERIAL PRIMARY KEY,
  rank           INT NOT NULL,
  title          TEXT NOT NULL,
  status         TEXT DEFAULT 'not_started' CHECK (status IN ('not_started','in_progress','done','carried','cut','blocked')),
  carried_weeks  INT DEFAULT 0,
  week_start     DATE NOT NULL,
  owner          TEXT,
  owner_id       INT,
  source         TEXT DEFAULT 'manual',
  updated_by     TEXT DEFAULT 'wizard',
  updated_at     TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE commitments_to_board (
  id             TEXT PRIMARY KEY,
  label          TEXT NOT NULL,
  current_value  NUMERIC,
  commit_value   NUMERIC NOT NULL,
  pace_value     NUMERIC,
  unit           TEXT,
  deadline       DATE NOT NULL,
  stakeholder    TEXT NOT NULL,
  direction      TEXT DEFAULT 'up' CHECK (direction IN ('up','down')),
  status         TEXT DEFAULT 'on_track' CHECK (status IN ('on_track','at_risk','behind','met')),
  source         TEXT DEFAULT 'manual',
  updated_by     TEXT DEFAULT 'wizard',
  updated_at     TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE risks (
  id             TEXT PRIMARY KEY,
  title          TEXT NOT NULL,
  owner          TEXT,
  mitigation     TEXT,
  severity       TEXT CHECK (severity IN ('low','med','high')),
  likelihood     TEXT CHECK (likelihood IN ('low','med','high')),
  trigger_metric TEXT,
  source         TEXT DEFAULT 'manual',
  updated_by     TEXT DEFAULT 'wizard',
  updated_at     TIMESTAMPTZ DEFAULT NOW()
);

-- ════════════════════════════════════════════════════════════════
-- COMMUNICATE · team and related
-- ════════════════════════════════════════════════════════════════

CREATE TABLE team_members (
  id             SERIAL PRIMARY KEY,
  name           TEXT NOT NULL,
  role           TEXT,
  focus          TEXT,
  tenure_start   DATE,
  last_promotion DATE,
  strengths      JSONB DEFAULT '[]'::JSONB,
  growth_edges   JSONB DEFAULT '[]'::JSONB,
  retention_risk JSONB,
  cadence        JSONB,
  blocker        TEXT,
  blocker_type   TEXT,
  email          TEXT,
  capture_enabled BOOLEAN DEFAULT FALSE,
  source         TEXT DEFAULT 'manual',
  updated_by     TEXT DEFAULT 'wizard',
  updated_at     TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE morale_history (
  id             SERIAL PRIMARY KEY,
  member_id      INT NOT NULL REFERENCES team_members(id) ON DELETE CASCADE,
  week_offset    INT NOT NULL,
  energy         INT CHECK (energy BETWEEN 1 AND 3),
  confidence     INT CHECK (confidence BETWEEN 1 AND 3),
  load_hours     INT,
  observed_at    TIMESTAMPTZ DEFAULT NOW(),
  source         TEXT DEFAULT 'darin'
);

CREATE TABLE checkins (
  id             SERIAL PRIMARY KEY,
  member_id      INT NOT NULL REFERENCES team_members(id) ON DELETE CASCADE,
  occurred_at    TIMESTAMPTZ DEFAULT NOW(),
  notes          TEXT,
  committed      JSONB DEFAULT '[]'::JSONB,
  updated_by     TEXT DEFAULT 'darin'
);

CREATE TABLE commitments (
  id             SERIAL PRIMARY KEY,
  member_id      INT REFERENCES team_members(id) ON DELETE CASCADE,
  from_party     TEXT NOT NULL,
  text           TEXT NOT NULL,
  due_date       DATE,
  status         TEXT DEFAULT 'open' CHECK (status IN ('open','in_progress','done','dropped')),
  created_at     TIMESTAMPTZ DEFAULT NOW(),
  updated_at     TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE comms_queue (
  id             SERIAL PRIMARY KEY,
  recipient      TEXT NOT NULL,
  recipient_id   INT,
  subject        TEXT NOT NULL,
  channel        TEXT CHECK (channel IN ('email','slack','meeting','phone','text')),
  urgency        TEXT DEFAULT 'normal' CHECK (urgency IN ('urgent','normal','low')),
  due_date       DATE,
  status         TEXT DEFAULT 'pending' CHECK (status IN ('pending','sent','skipped')),
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

-- ════════════════════════════════════════════════════════════════
-- NAVIGATE · initiatives + OKRs + decisions
-- ════════════════════════════════════════════════════════════════

CREATE TABLE initiatives (
  id             SERIAL PRIMARY KEY,
  name           TEXT NOT NULL,
  theme          TEXT,
  investment     NUMERIC,
  horizon        TEXT,
  progress       INT DEFAULT 0,
  pace           INT DEFAULT 0,
  confidence     TEXT CHECK (confidence IN ('high','medium','low')),
  owner_id       INT REFERENCES team_members(id) ON DELETE SET NULL,
  impact         TEXT,
  summary        TEXT,
  next_step      TEXT,
  status         TEXT DEFAULT 'active' CHECK (status IN ('active','paused','done','killed')),
  updated_at     TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE pace_history (
  id             SERIAL PRIMARY KEY,
  initiative_id  INT NOT NULL REFERENCES initiatives(id) ON DELETE CASCADE,
  week_offset    INT NOT NULL,
  progress       INT NOT NULL,
  expected       INT NOT NULL,
  recorded_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE okrs (
  id             SERIAL PRIMARY KEY,
  objective      TEXT NOT NULL,
  progress       INT DEFAULT 0,
  pace           INT DEFAULT 0,
  status         TEXT DEFAULT 'on_track' CHECK (status IN ('on_track','at_risk','behind')),
  owner          TEXT,
  quarter        TEXT,
  updated_at     TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE decisions_pending (
  id             SERIAL PRIMARY KEY,
  title          TEXT NOT NULL,
  context        TEXT,
  stakes         TEXT,
  deadline       DATE,
  age_days       INT DEFAULT 0,
  options        JSONB DEFAULT '[]'::JSONB,
  status         TEXT DEFAULT 'open' CHECK (status IN ('open','decided','deferred')),
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

-- ════════════════════════════════════════════════════════════════
-- TEAM INBOX · magic-link capture
-- ════════════════════════════════════════════════════════════════

CREATE TABLE team_access_tokens (
  token          TEXT PRIMARY KEY,
  member_id      INT NOT NULL REFERENCES team_members(id) ON DELETE CASCADE,
  label          TEXT,
  issued_at      TIMESTAMPTZ DEFAULT NOW(),
  expires_at     TIMESTAMPTZ DEFAULT NOW() + INTERVAL '30 days',
  last_used_at   TIMESTAMPTZ,
  revoked        BOOLEAN DEFAULT FALSE
);

CREATE TABLE team_submissions (
  id             SERIAL PRIMARY KEY,
  member_id      INT NOT NULL REFERENCES team_members(id) ON DELETE CASCADE,
  submission_type TEXT NOT NULL CHECK (submission_type IN ('blocker','progress','decision','fyi')),
  content        TEXT NOT NULL,
  urgency        TEXT DEFAULT 'normal' CHECK (urgency IN ('low','normal','high')),
  initiative_id  INT REFERENCES initiatives(id) ON DELETE SET NULL,
  status         TEXT DEFAULT 'pending' CHECK (status IN ('pending','accepted','refined','discarded','deferred')),
  review_notes   TEXT,
  submitted_at   TIMESTAMPTZ DEFAULT NOW(),
  reviewed_at    TIMESTAMPTZ,
  reviewed_by    TEXT
);
CREATE INDEX idx_submissions_status ON team_submissions(status, submitted_at DESC);

-- ════════════════════════════════════════════════════════════════
-- ACTIVITY LOG
-- ════════════════════════════════════════════════════════════════

CREATE TABLE activity_log (
  id             SERIAL PRIMARY KEY,
  panel          TEXT CHECK (panel IN ('aviate','navigate','communicate')),
  summary        TEXT NOT NULL,
  actor          TEXT DEFAULT 'darin',
  timestamp      TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_activity_timestamp ON activity_log(timestamp DESC);

-- ════════════════════════════════════════════════════════════════
-- INITIAL APP CONFIG · empty, populated by wizard
-- ════════════════════════════════════════════════════════════════

INSERT INTO app_config (key, value) VALUES
  ('company_name', '"Your Company"'::jsonb),
  ('user_display_name', '"User"'::jsonb),
  ('tabs_enabled', '["aviate","navigate","communicate"]'::jsonb),
  ('intake_methods_enabled', '["claude"]'::jsonb),
  ('demo_mode_enabled', 'false'::jsonb),
  ('setup_complete', 'false'::jsonb),
  ('setup_step', '"00_welcome"'::jsonb);

-- ════════════════════════════════════════════════════════════════
-- SECTION CONFIG · off by default, wizard enables
-- ════════════════════════════════════════════════════════════════

INSERT INTO section_config (tab, section_key, label, enabled, display_order) VALUES
  ('aviate','pulse_realtime','Realtime pulse',FALSE,10),
  ('aviate','pulse_leading','Leading indicators',FALSE,20),
  ('aviate','pulse_mtd','Month-to-date',FALSE,30),
  ('aviate','pulse_qtd','Quarter-to-date',FALSE,40),
  ('aviate','pulse_ytd','Year-to-date',FALSE,50),
  ('aviate','today_agenda','Today agenda',FALSE,60),
  ('aviate','eyes_on_you','Eyes on you',FALSE,70),
  ('aviate','ceo_desk','CEO desk',FALSE,80),
  ('aviate','commitments','Commitments to leadership',FALSE,90),
  ('aviate','risks','Risk register',FALSE,100),
  ('aviate','priorities','Weekly priorities',FALSE,110),
  ('aviate','blockers','Blockers',FALSE,120),
  ('aviate','claims_process','Claims process control',FALSE,130),
  ('aviate','horizon_trio','Margin horizon view',FALSE,140),
  ('navigate','portfolio_header','Transformation portfolio',FALSE,10),
  ('navigate','initiatives','Initiatives',FALSE,20),
  ('navigate','okrs','Quarterly objectives',FALSE,30),
  ('navigate','decisions','Decisions on your desk',FALSE,40),
  ('communicate','team_rhythm','Team rhythm bar',FALSE,10),
  ('communicate','succession','Succession / talent depth',FALSE,20),
  ('communicate','team','Direct reports',FALSE,30),
  ('communicate','team_inbox','Team inbox (magic-link)',FALSE,35),
  ('communicate','need_you','Need you',FALSE,40),
  ('communicate','comms_queue','Comms queue',FALSE,50);
