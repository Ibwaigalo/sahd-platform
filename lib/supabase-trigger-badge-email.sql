-- SAHD Platform - Trigger for Badge Email on Verification
-- Run this in your Supabase SQL Editor

-- Create the function that sends badge email when verified = true
CREATE OR REPLACE FUNCTION send_badge_email_on_verification()
RETURNS TRIGGER AS $$
DECLARE
  webhook_url TEXT;
BEGIN
  -- Only trigger when verified changes to true (not on initial insert)
  IF NEW.verified = TRUE AND (OLD.verified = FALSE OR OLD.verified IS NULL) THEN
    -- Call the Next.js API endpoint to send the badge email
    webhook_url := current_setting('app.settings.webhook_url', TRUE);
    
    PERFORM net.http_post(
      url := current_setting('app.settings.api_url', TRUE) || '/api/send-email',
      headers := '{"Content-Type": "application/json"}'::jsonb,
      body := jsonb_build_object(
        'type', 'validation',
        'to', NEW.email,
        'name', NEW.full_name,
        'organization', COALESCE(NEW.organization, ''),
        'category', COALESCE(NEW.category, 'visiteur'),
        'badgeNumber', NEW.badge_number
      )
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger on profiles table
DROP TRIGGER IF EXISTS on_verification_update ON profiles;
CREATE TRIGGER on_verification_update
  AFTER UPDATE OF verified ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION send_badge_email_on_verification();

-- Enable HTTP extension for webhook calls
CREATE EXTENSION IF NOT EXISTS http;

-- Configure app settings (run these in Supabase Dashboard > Configuration > Secrets)
-- Or set them via SQL:
-- ALTER DATABASE postgres SET app.settings.api_url TO 'https://your-domain.com';

-- Note: For Supabase Edge Functions, you can also use this alternative approach:
-- Create an Edge Function at supabase/functions/send-badge-email/index.ts
-- that listens to the database webhook
