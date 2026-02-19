-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create user profiles table to track all users
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'manager', 'sales_rep')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create leads table
CREATE TABLE IF NOT EXISTS leads (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT NOT NULL,
  source TEXT NOT NULL,
  status TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create history table
CREATE TABLE IF NOT EXISTS history (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  lead_id TEXT NOT NULL,
  lead_name TEXT NOT NULL,
  action TEXT NOT NULL CHECK (action IN ('created', 'updated', 'deleted', 'status_changed')),
  details TEXT NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_leads_user_id ON leads(user_id);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_history_timestamp ON history(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_history_user_id ON history(user_id);

-- Create helper functions before policies
CREATE OR REPLACE FUNCTION is_manager_or_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM auth.users
    WHERE id = auth.uid()
    AND (raw_user_meta_data->>'role' IN ('manager', 'admin') OR email = 'admin@gmail.com')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM auth.users
    WHERE id = auth.uid()
    AND (email = 'admin@gmail.com' OR raw_user_meta_data->>'role' = 'admin')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enable Row Level Security
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE history ENABLE ROW LEVEL SECURITY;

-- Create policies for leads table
CREATE POLICY "Sales reps can view their own leads"
  ON leads FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Managers can view all leads"
  ON leads FOR SELECT
  USING (is_manager_or_admin());

CREATE POLICY "Users can insert their own leads"
  ON leads FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Sales reps can update their own leads"
  ON leads FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Managers can update all leads"
  ON leads FOR UPDATE
  USING (is_manager_or_admin());

CREATE POLICY "Sales reps can delete their own leads"
  ON leads FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Managers can delete all leads"
  ON leads FOR DELETE
  USING (is_manager_or_admin());

-- Create policies for history table
CREATE POLICY "Sales reps can view their own history"
  ON history FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Managers can view all history"
  ON history FOR SELECT
  USING (is_manager_or_admin());

CREATE POLICY "Users can insert their own history"
  ON history FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_leads_updated_at
  BEFORE UPDATE ON leads
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create function to automatically set user_id in history
CREATE OR REPLACE FUNCTION set_history_user_id()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.user_id IS NULL THEN
    NEW.user_id = auth.uid();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to set user_id in history
CREATE TRIGGER set_history_user_id_trigger
  BEFORE INSERT ON history
  FOR EACH ROW
  EXECUTE FUNCTION set_history_user_id();

-- Create function to automatically create user profile on signup
CREATE OR REPLACE FUNCTION create_user_profile()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_profiles (id, name, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.email,
    CASE 
      WHEN NEW.email = 'admin@gmail.com' THEN 'admin'
      ELSE COALESCE(NEW.raw_user_meta_data->>'role', 'sales_rep')
    END
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Backfill user profiles for existing auth users
CREATE OR REPLACE FUNCTION backfill_user_profiles()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth AS $$
DECLARE
  inserted_count INTEGER;
BEGIN
  IF NOT is_admin() THEN
    RAISE EXCEPTION 'Only admins can backfill user profiles';
  END IF;

  INSERT INTO user_profiles (id, name, email, role, created_at)
  SELECT
    u.id,
    COALESCE(u.raw_user_meta_data->>'name', split_part(u.email, '@', 1)),
    u.email,
    CASE
      WHEN u.email = 'admin@gmail.com' THEN 'admin'
      ELSE COALESCE(u.raw_user_meta_data->>'role', 'sales_rep')
    END,
    u.created_at
  FROM auth.users u
  LEFT JOIN user_profiles p ON p.id = u.id
  WHERE p.id IS NULL;

  GET DIAGNOSTICS inserted_count = ROW_COUNT;
  RETURN inserted_count;
END;
$$;

-- Create trigger to create user profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION create_user_profile();

-- Create RLS-enabled function to delete auth user (must be called from backend with admin credentials)
CREATE OR REPLACE FUNCTION delete_user_and_auth(user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  success BOOLEAN;
BEGIN
  -- Check if the current user is an admin
  IF NOT is_admin() THEN
    RAISE EXCEPTION 'Only admins can delete users';
  END IF;

  -- Delete from user_profiles (which should cascade to delete dependent records)
  DELETE FROM user_profiles WHERE id = user_id;
  
  -- Note: Deleting from auth.users must be done via Supabase Admin API
  -- from your backend due to auth schema restrictions. Call your backend
  -- endpoint with the user_id after this function succeeds.
  
  RETURN TRUE;
EXCEPTION
  WHEN OTHERS THEN
    RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enable RLS on user_profiles
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Policies for user_profiles (admins can see all, users can see their own)
CREATE POLICY "Admins can view all user profiles"
  ON user_profiles FOR SELECT
  USING (is_admin());

CREATE POLICY "Managers can view all user profiles"
  ON user_profiles FOR SELECT
  USING (is_manager_or_admin());

CREATE POLICY "Users can view their own profile"
  ON user_profiles FOR SELECT
  USING (auth.uid() = id);


CREATE POLICY "Allow profile creation on signup"
  ON user_profiles FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can update user profiles"
  ON user_profiles FOR UPDATE
  USING (is_admin());

CREATE POLICY "Admins can delete user profiles"
  ON user_profiles FOR DELETE
  USING (is_admin());

