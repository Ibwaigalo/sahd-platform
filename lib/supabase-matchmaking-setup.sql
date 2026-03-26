-- ============================================
-- MATCHMAKING SYSTEM - Exécutez ce SQL dans Supabase SQL Editor
-- ============================================

-- 1. Ajouter les colonnes manquantes à user_profiles
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS domains TEXT[];
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS looking_for TEXT;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS offering TEXT;

-- 2. Créer la table des demandes de RDV
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

-- 3. Activer RLS sur meeting_requests
ALTER TABLE meeting_requests ENABLE ROW LEVEL SECURITY;

-- 4. Politiques RLS pour meeting_requests
DROP POLICY IF EXISTS "Users can view their meeting requests" ON meeting_requests;
CREATE POLICY "Users can view their meeting requests" ON meeting_requests
  FOR SELECT USING (auth.uid() = requester_id OR auth.uid() = target_id);

DROP POLICY IF EXISTS "Users can create meeting requests" ON meeting_requests;
CREATE POLICY "Users can create meeting requests" ON meeting_requests
  FOR INSERT WITH CHECK (auth.uid() = requester_id);

DROP POLICY IF EXISTS "Users can update their meeting requests" ON meeting_requests;
CREATE POLICY "Users can update their meeting requests" ON meeting_requests
  FOR UPDATE USING (auth.uid() = requester_id OR auth.uid() = target_id);

-- 5. Activer Realtime pour meeting_requests
ALTER PUBLICATION supabase_realtime ADD TABLE meeting_requests;

-- 6. Ajouter les index pour les performances
CREATE INDEX IF NOT EXISTS idx_user_profiles_domains ON user_profiles USING GIN(domains);
CREATE INDEX IF NOT EXISTS idx_meeting_requests_requester ON meeting_requests(requester_id);
CREATE INDEX IF NOT EXISTS idx_meeting_requests_target ON meeting_requests(target_id);
CREATE INDEX IF NOT EXISTS idx_meeting_requests_status ON meeting_requests(status);
