-- Create profiles table for user information
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  name TEXT,
  avatar_url TEXT,
  bio TEXT,
  contact_info TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create property_listings table
CREATE TABLE IF NOT EXISTS property_listings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  title TEXT NOT NULL,
  price NUMERIC NOT NULL,
  description TEXT,
  location TEXT,
  features JSONB,
  cta_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create property_images table to store image references
CREATE TABLE IF NOT EXISTS property_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID REFERENCES property_listings(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create leads table to track lead generation
CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID REFERENCES property_listings(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT,
  lead_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create views table to track property views
CREATE TABLE IF NOT EXISTS property_views (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID REFERENCES property_listings(id) ON DELETE CASCADE,
  viewer_ip TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_views ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Profiles policies
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Property listings policies
DROP POLICY IF EXISTS "Anyone can view property listings" ON property_listings;
CREATE POLICY "Anyone can view property listings"
  ON property_listings FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Users can create their own property listings" ON property_listings;
CREATE POLICY "Users can create their own property listings"
  ON property_listings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own property listings" ON property_listings;
CREATE POLICY "Users can update their own property listings"
  ON property_listings FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own property listings" ON property_listings;
CREATE POLICY "Users can delete their own property listings"
  ON property_listings FOR DELETE
  USING (auth.uid() = user_id);

-- Property images policies
DROP POLICY IF EXISTS "Anyone can view property images" ON property_images;
CREATE POLICY "Anyone can view property images"
  ON property_images FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Users can manage their own property images" ON property_images;
CREATE POLICY "Users can manage their own property images"
  ON property_images FOR ALL
  USING (EXISTS (
    SELECT 1 FROM property_listings
    WHERE property_listings.id = property_images.property_id
    AND property_listings.user_id = auth.uid()
  ));

-- Leads policies
DROP POLICY IF EXISTS "Anyone can create leads" ON leads;
CREATE POLICY "Anyone can create leads"
  ON leads FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Users can view leads for their properties" ON leads;
CREATE POLICY "Users can view leads for their properties"
  ON leads FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM property_listings
    WHERE property_listings.id = leads.property_id
    AND property_listings.user_id = auth.uid()
  ));

-- Property views policies
DROP POLICY IF EXISTS "Anyone can create property views" ON property_views;
CREATE POLICY "Anyone can create property views"
  ON property_views FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Users can view analytics for their properties" ON property_views;
CREATE POLICY "Users can view analytics for their properties"
  ON property_views FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM property_listings
    WHERE property_listings.id = property_views.property_id
    AND property_listings.user_id = auth.uid()
  ));

-- Create function to handle user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, avatar_url)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'avatar_url');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Enable realtime for all tables
alter publication supabase_realtime add table profiles;
alter publication supabase_realtime add table property_listings;
alter publication supabase_realtime add table property_images;
alter publication supabase_realtime add table leads;
alter publication supabase_realtime add table property_views;
