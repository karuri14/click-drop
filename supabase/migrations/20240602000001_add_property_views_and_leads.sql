-- Create property_views table if it doesn't exist
CREATE TABLE IF NOT EXISTS property_views (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID NOT NULL REFERENCES property_listings(id) ON DELETE CASCADE,
  viewer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create leads table if it doesn't exist
CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID NOT NULL REFERENCES property_listings(id) ON DELETE CASCADE,
  name TEXT,
  email TEXT,
  phone TEXT,
  message TEXT,
  lead_type TEXT,
  status TEXT DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add realtime support
alter publication supabase_realtime add table property_listings;
alter publication supabase_realtime add table property_views;
alter publication supabase_realtime add table leads;

-- Add views_count and leads_count to property_listings
ALTER TABLE property_listings ADD COLUMN IF NOT EXISTS views_count INTEGER DEFAULT 0;
ALTER TABLE property_listings ADD COLUMN IF NOT EXISTS leads_count INTEGER DEFAULT 0;

-- Create function to update views_count
CREATE OR REPLACE FUNCTION update_property_views_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE property_listings
  SET views_count = (
    SELECT COUNT(*) FROM property_views WHERE property_id = NEW.property_id
  )
  WHERE id = NEW.property_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create function to update leads_count
CREATE OR REPLACE FUNCTION update_property_leads_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE property_listings
  SET leads_count = (
    SELECT COUNT(*) FROM leads WHERE property_id = NEW.property_id
  )
  WHERE id = NEW.property_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
DROP TRIGGER IF EXISTS update_property_views_count_trigger ON property_views;
CREATE TRIGGER update_property_views_count_trigger
AFTER INSERT OR DELETE ON property_views
FOR EACH ROW
EXECUTE FUNCTION update_property_views_count();

DROP TRIGGER IF EXISTS update_property_leads_count_trigger ON leads;
CREATE TRIGGER update_property_leads_count_trigger
AFTER INSERT OR DELETE ON leads
FOR EACH ROW
EXECUTE FUNCTION update_property_leads_count();
