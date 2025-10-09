-- TriglyCoach - Drop Old Tables and Recreate
-- Run this in your Supabase SQL Editor

-- Step 1: Drop existing triggers
DROP TRIGGER IF EXISTS update_daily_entries_updated_at ON daily_entries;
DROP TRIGGER IF EXISTS update_checklist_templates_updated_at ON checklist_templates;
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Step 2: Drop existing functions
DROP FUNCTION IF EXISTS update_updated_at_column();
DROP FUNCTION IF EXISTS handle_new_user();

-- Step 3: Drop existing tables (cascade removes all dependencies)
DROP TABLE IF EXISTS daily_entries CASCADE;
DROP TABLE IF EXISTS checklist_templates CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- Step 4: Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Step 5: Create profiles table (no auth dependencies)
CREATE TABLE profiles (
  id TEXT PRIMARY KEY,
  name TEXT,
  reminder_times TEXT[] DEFAULT ARRAY['08:00', '13:00', '20:00'],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 6: Create checklist templates table
CREATE TABLE checklist_templates (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id TEXT REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  sections JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Step 7: Create daily entries table
CREATE TABLE daily_entries (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id TEXT REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  sections JSONB NOT NULL,
  day_complete BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- Step 8: Create updated_at function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Step 9: Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_checklist_templates_updated_at BEFORE UPDATE ON checklist_templates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_daily_entries_updated_at BEFORE UPDATE ON daily_entries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Step 10: Insert the fixed user profile
INSERT INTO profiles (id, name, reminder_times)
VALUES ('fixed-user-id', '', ARRAY['08:00', '13:00', '20:00'])
ON CONFLICT (id) DO NOTHING;
