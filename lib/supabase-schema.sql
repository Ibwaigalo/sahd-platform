-- SAHD Platform - Supabase Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- User Profiles
CREATE TABLE IF NOT EXISTS profiles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  organization TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  category TEXT CHECK (category IN ('visiteur', 'participant', 'exposant', 'vip_b2b', 'admin')) DEFAULT 'visiteur',
  domain TEXT,
  logo_url TEXT,
  badge_number TEXT UNIQUE,
  qr_code TEXT,
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Panels
CREATE TABLE IF NOT EXISTS panels (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  day INTEGER NOT NULL,
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  title TEXT NOT NULL,
  title_en TEXT,
  description TEXT,
  description_en TEXT,
  room TEXT,
  capacity INTEGER DEFAULT 100,
  category TEXT,
  category_en TEXT,
  color TEXT DEFAULT '#1e3a8a',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Panel Speakers (junction)
CREATE TABLE IF NOT EXISTS panel_speakers (
  panel_id UUID REFERENCES panels(id) ON DELETE CASCADE,
  speaker_id TEXT NOT NULL,
  PRIMARY KEY (panel_id, speaker_id)
);

-- Panel Reservations
CREATE TABLE IF NOT EXISTS panel_reservations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  panel_id UUID REFERENCES panels(id) ON DELETE CASCADE,
  status TEXT CHECK (status IN ('confirmed', 'waitlist', 'cancelled')) DEFAULT 'confirmed',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, panel_id)
);

-- B2B Meetings
CREATE TABLE IF NOT EXISTS b2b_meetings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  requester_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  target_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  meeting_date DATE,
  meeting_time TIME,
  duration INTEGER DEFAULT 30,
  status TEXT CHECK (status IN ('pending', 'confirmed', 'cancelled')) DEFAULT 'pending',
  notes TEXT,
  location TEXT DEFAULT 'Espace B2B – Stand 12',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Messages (internal chat)
CREATE TABLE IF NOT EXISTS messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  receiver_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sponsors
CREATE TABLE IF NOT EXISTS sponsors (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  tier TEXT CHECK (tier IN ('platine', 'or', 'argent', 'media', 'partenaire')) DEFAULT 'partenaire',
  logo_url TEXT,
  website_url TEXT,
  description TEXT,
  description_en TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Media Gallery
CREATE TABLE IF NOT EXISTS media_gallery (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  type TEXT CHECK (type IN ('photo', 'video', 'document')) NOT NULL,
  title TEXT,
  url TEXT NOT NULL,
  thumbnail_url TEXT,
  category TEXT,
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Contact Form Submissions
CREATE TABLE IF NOT EXISTS contact_submissions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  organization TEXT,
  subject TEXT,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'general',
  status TEXT DEFAULT 'new',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE panel_reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE b2b_meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- User profiles: users can read their own profile
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Panel reservations
CREATE POLICY "Users can view own reservations" ON panel_reservations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create reservations" ON panel_reservations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can cancel own reservations" ON panel_reservations
  FOR UPDATE USING (auth.uid() = user_id);

-- B2B meetings
CREATE POLICY "VIP users can view their meetings" ON b2b_meetings
  FOR SELECT USING (auth.uid() = requester_id OR auth.uid() = target_id);

CREATE POLICY "VIP users can create meetings" ON b2b_meetings
  FOR INSERT WITH CHECK (auth.uid() = requester_id);

-- Messages
CREATE POLICY "Users can view their messages" ON messages
  FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can send messages" ON messages
  FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- Enable realtime for messages
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
ALTER PUBLICATION supabase_realtime ADD TABLE b2b_meetings;

-- Indexes for performance
CREATE INDEX idx_profiles_user_id ON profiles(user_id);
CREATE INDEX idx_panel_reservations_user_id ON panel_reservations(user_id);
CREATE INDEX idx_panel_reservations_panel_id ON panel_reservations(panel_id);
CREATE INDEX idx_messages_receiver_id ON messages(receiver_id);
CREATE INDEX idx_messages_sender_id ON messages(sender_id);
