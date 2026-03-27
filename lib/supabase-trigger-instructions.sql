-- SAHD Platform - Database Webhook for Badge Email
-- Run this in your Supabase SQL Editor

-- Option 1: Using Supabase Edge Function (Recommended)
-- Deploy the Edge Function first:
-- supabase functions deploy send-badge-email

-- Then create a database webhook to trigger it
-- Note: For database webhooks, you need to enable the Supabase webhook service
-- or use pg_cron with a webhook POST

-- Option 2: Direct pg_net HTTP call (requires pg_net extension)
-- First, check if pg_net is enabled:
-- SELECT * FROM pg_extension WHERE extname = 'pg_net';

-- If pg_net is enabled, use this trigger:
/*
CREATE OR REPLACE FUNCTION send_badge_email_on_verification()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.verified = TRUE AND (OLD.verified = FALSE OR OLD.verified IS NULL) THEN
    -- Get project reference from environment
    DECLARE
      supabase_ref TEXT := current_setting('app.settings.supabase_ref', TRUE);
      anon_key TEXT := current_setting('app.settings.supabase_anon_key', TRUE);
    BEGIN
      PERFORM net.http_post(
        url := 'https://' || supabase_ref || '.supabase.co/functions/v1/send-badge-email',
        headers := jsonb_build_object(
          'Content-Type', 'application/json',
          'Authorization', 'Bearer ' || anon_key
        ),
        body := jsonb_build_object(
          'type', 'validation',
          'to', NEW.email,
          'name', NEW.full_name,
          'organization', COALESCE(NEW.organization, ''),
          'category', COALESCE(NEW.category, 'visiteur'),
          'badgeNumber', NEW.badge_number
        )
      );
    END;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_verification_update
  AFTER UPDATE OF verified ON profiles
  FOR EACH ROW
  WHEN (NEW.verified = TRUE AND (OLD.verified = FALSE OR OLD.verified IS NULL))
  EXECUTE FUNCTION send_badge_email_on_verification();
*/

-- Option 3: Simplified trigger that logs for verification (no external calls)
-- This is useful for testing - check the logs in Supabase Dashboard
CREATE OR REPLACE FUNCTION log_verification_event()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.verified = TRUE AND (OLD.verified = FALSE OR OLD.verified IS NULL) THEN
    RAISE LOG 'VERIFICATION_EVENT: user_id=%, email=%, badge_number=%, name=%',
      NEW.user_id, NEW.email, NEW.badge_number, NEW.full_name;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_verification_log ON profiles;
CREATE TRIGGER on_verification_log
  AFTER UPDATE OF verified ON profiles
  FOR EACH ROW
  WHEN (NEW.verified = TRUE AND (OLD.verified = FALSE OR OLD.verified IS NULL))
  EXECUTE FUNCTION log_verification_event();

-- ============================================
-- DEPLOYMENT INSTRUCTIONS
-- ============================================

-- Step 1: Deploy the Edge Function
-- supabase functions deploy send-badge-email

-- Step 2: Set the RESEND_API_KEY secret
-- supabase secrets set RESEND_API_KEY=re_xxxxx

-- Step 3: For production with pg_net, run the trigger SQL above
-- Or use Supabase Webhooks (Dashboard > Database > Webhooks)
-- Create a new webhook pointing to your Edge Function URL

-- ============================================
-- MANUAL TESTING
-- ============================================

-- Test the email API directly:
-- curl -X POST https://your-domain.com/api/send-email \
--   -H "Content-Type: application/json" \
--   -d '{
--     "type": "validation",
--     "to": "test@example.com",
--     "name": "Test User",
--     "organization": "Test Org",
--     "category": "participant",
--     "badgeNumber": "SAHD-001"
--   }'
