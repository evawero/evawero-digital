-- Evawero Digital Agents — Database Migration 001
-- Run against the shared Railway PostgreSQL database

-- Agent activity logs
CREATE TABLE IF NOT EXISTS agent_logs (
  id SERIAL PRIMARY KEY,
  agent_name VARCHAR(50) NOT NULL,
  run_at TIMESTAMPTZ DEFAULT NOW(),
  status VARCHAR(20) NOT NULL,
  actions JSONB,
  results JSONB,
  needs_attention JSONB,
  metadata JSONB,
  error TEXT
);

-- Lead pipeline
CREATE TABLE IF NOT EXISTS leads (
  id SERIAL PRIMARY KEY,
  name VARCHAR(200),
  company VARCHAR(200),
  email VARCHAR(200),
  phone VARCHAR(50),
  market VARCHAR(20),
  region VARCHAR(100),
  source VARCHAR(100),
  status VARCHAR(50),
  language VARCHAR(10),
  last_contacted_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Client projects
CREATE TABLE IF NOT EXISTS projects (
  id SERIAL PRIMARY KEY,
  notion_task_id VARCHAR(200) UNIQUE,
  client_name VARCHAR(200),
  project_title VARCHAR(300),
  brief TEXT,
  status VARCHAR(50),
  deadline DATE,
  deliverables JSONB,
  last_updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Content calendar
CREATE TABLE IF NOT EXISTS content_calendar (
  id SERIAL PRIMARY KEY,
  agent VARCHAR(50),
  platform VARCHAR(50),
  language VARCHAR(10),
  market VARCHAR(20),
  title VARCHAR(300),
  content TEXT,
  scheduled_for TIMESTAMPTZ,
  status VARCHAR(30),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Dashboard alerts
CREATE TABLE IF NOT EXISTS alerts (
  id SERIAL PRIMARY KEY,
  level VARCHAR(20),
  source_agent VARCHAR(50),
  title VARCHAR(300),
  description TEXT,
  action_url VARCHAR(500),
  dismissed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_agent_logs_agent ON agent_logs(agent_name);
CREATE INDEX IF NOT EXISTS idx_agent_logs_run_at ON agent_logs(run_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_market ON leads(market);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_content_calendar_status ON content_calendar(status);
CREATE INDEX IF NOT EXISTS idx_alerts_dismissed ON alerts(dismissed);
