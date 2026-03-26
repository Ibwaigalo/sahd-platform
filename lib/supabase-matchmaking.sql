-- SAHD Platform - Matchmaking System Schema
-- Run this in your Supabase SQL Editor

-- ============================================
-- MATCHMAKING TABLES
-- ============================================

-- Matchmaking Interests (what each user is looking for)
CREATE TABLE IF NOT EXISTS matchmaking_interests (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  domain TEXT NOT NULL,
  interest_type TEXT CHECK (interest_type IN ('offering', 'seeking', 'both')) DEFAULT 'both',
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, domain)
);

-- Matchmaking Recommendations Cache (pre-computed for performance)
CREATE TABLE IF NOT EXISTS matchmaking_recommendations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  recommended_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  match_score DECIMAL(3,2) DEFAULT 0,
  shared_domains TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, recommended_user_id)
);

-- Meeting Requests (improved B2B workflow)
CREATE TABLE IF NOT EXISTS meeting_requests (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  requester_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  target_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  meeting_date DATE NOT NULL,
  meeting_time TIME NOT NULL,
  duration INTEGER DEFAULT 30,
  message TEXT,
  status TEXT CHECK (status IN ('pending', 'accepted', 'declined', 'cancelled')) DEFAULT 'pending',
  location TEXT DEFAULT 'Espace B2B – Stand principal',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(requester_id, target_id, meeting_date, meeting_time)
);

-- ============================================
-- UPDATE EXISTING TABLES
-- ============================================

-- Add domain field to user_profiles (if not exists)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_profiles' AND column_name = 'domain') THEN
    ALTER TABLE user_profiles ADD COLUMN domain TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_profiles' AND column_name = 'domains') THEN
    ALTER TABLE user_profiles ADD COLUMN domains TEXT[];
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_profiles' AND column_name = 'looking_for') THEN
    ALTER TABLE user_profiles ADD COLUMN looking_for TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_profiles' AND column_name = 'offering') THEN
    ALTER TABLE user_profiles ADD COLUMN offering TEXT;
  END IF;
END $$;

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

ALTER TABLE matchmaking_interests ENABLE ROW LEVEL SECURITY;
ALTER TABLE matchmaking_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE meeting_requests ENABLE ROW LEVEL SECURITY;

-- Matchmaking interests policies
CREATE POLICY "Users can view own interests" ON matchmaking_interests
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own interests" ON matchmaking_interests
  FOR ALL USING (auth.uid() = user_id);

-- Matchmaking recommendations policies
CREATE POLICY "Users can view own recommendations" ON matchmaking_recommendations
  FOR SELECT USING (auth.uid() = user_id);

-- Meeting requests policies
CREATE POLICY "Users can view their meeting requests" ON meeting_requests
  FOR SELECT USING (auth.uid() = requester_id OR auth.uid() = target_id);

CREATE POLICY "Users can create meeting requests" ON meeting_requests
  FOR INSERT WITH CHECK (auth.uid() = requester_id);

CREATE POLICY "Users can update their meeting requests" ON meeting_requests
  FOR UPDATE USING (auth.uid() = requester_id OR auth.uid() = target_id);

-- ============================================
-- REALTIME
-- ============================================

ALTER PUBLICATION supabase_realtime ADD TABLE meeting_requests;
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
ALTER PUBLICATION supabase_realtime ADD TABLE matchmaking_recommendations;

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_matchmaking_interests_user_id ON matchmaking_interests(user_id);
CREATE INDEX IF NOT EXISTS idx_matchmaking_interests_domain ON matchmaking_interests(domain);
CREATE INDEX IF NOT EXISTS idx_matchmaking_recommendations_user_id ON matchmaking_recommendations(user_id);
CREATE INDEX IF NOT EXISTS idx_meeting_requests_requester ON meeting_requests(requester_id);
CREATE INDEX IF NOT EXISTS idx_meeting_requests_target ON meeting_requests(target_id);
CREATE INDEX IF NOT EXISTS idx_meeting_requests_status ON meeting_requests(status);
CREATE INDEX IF NOT EXISTS idx_user_profiles_domains ON user_profiles USING GIN(domains);

-- ============================================
-- DOMAINS LIST (reference)
-- ============================================

/*
Available domains for the SAHD 2026:
- santé (Health)
- éducation (Education)
- nutrition (Nutrition)
- eau et assainissement (Water & Sanitation)
- protection de l'enfance (Child Protection)
-genre et inclusion (Gender & Inclusion)
- résilience climatique (Climate Resilience)
- sécurité alimentaire (Food Security)
- financement / Funding
- technologie / Technology
- coordination humanitaire (Humanitarian Coordination)
- développement économique (Economic Development)
- environnement (Environment)
*/
