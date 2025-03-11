-- Update auth.users table to set email_confirmed_at for existing users
UPDATE auth.users
SET email_confirmed_at = COALESCE(email_confirmed_at, created_at)
WHERE email_confirmed_at IS NULL;

-- Modify the sign-up trigger to automatically confirm emails
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Set email_confirmed_at to the current timestamp for new users
  UPDATE auth.users
  SET email_confirmed_at = now()
  WHERE id = NEW.id AND email_confirmed_at IS NULL;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Make sure the trigger exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
