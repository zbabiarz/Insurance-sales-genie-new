-- Create insurance_plans table
CREATE TABLE IF NOT EXISTS insurance_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_name TEXT NOT NULL,
  product_name TEXT NOT NULL,
  product_category TEXT NOT NULL,
  product_price DECIMAL(10, 2) NOT NULL,
  product_benefits TEXT,
  disqualifying_health_conditions TEXT[],
  disqualifying_medications TEXT[],
  available_states TEXT[],
  available_zip_codes TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create health_conditions reference table
CREATE TABLE IF NOT EXISTS health_conditions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create medications reference table
CREATE TABLE IF NOT EXISTS medications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create clients table
CREATE TABLE IF NOT EXISTS clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  full_name TEXT NOT NULL,
  date_of_birth DATE NOT NULL,
  zip_code TEXT NOT NULL,
  state TEXT NOT NULL,
  height DECIMAL(5, 2),
  weight DECIMAL(5, 2),
  health_conditions TEXT[],
  medications TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create dependents table
CREATE TABLE IF NOT EXISTS dependents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  relationship TEXT NOT NULL,
  full_name TEXT NOT NULL,
  date_of_birth DATE NOT NULL,
  height DECIMAL(5, 2),
  weight DECIMAL(5, 2),
  health_conditions TEXT[],
  medications TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert sample health conditions
INSERT INTO health_conditions (name, description)
VALUES 
  ('Diabetes Type 1', 'Insulin-dependent diabetes'),
  ('Diabetes Type 2', 'Non-insulin-dependent diabetes'),
  ('Hypertension', 'High blood pressure'),
  ('Asthma', 'Chronic respiratory condition'),
  ('Heart Disease', 'Cardiovascular conditions'),
  ('Cancer', 'Any type of cancer'),
  ('Obesity', 'BMI over 30'),
  ('Sleep Apnea', 'Sleep disorder'),
  ('COPD', 'Chronic Obstructive Pulmonary Disease'),
  ('Arthritis', 'Joint inflammation')
ON CONFLICT (name) DO NOTHING;

-- Insert sample medications
INSERT INTO medications (name, description)
VALUES 
  ('Metformin', 'For diabetes management'),
  ('Lisinopril', 'For hypertension'),
  ('Atorvastatin', 'For cholesterol management'),
  ('Albuterol', 'For asthma'),
  ('Levothyroxine', 'For thyroid conditions'),
  ('Insulin', 'For diabetes management'),
  ('Omeprazole', 'For acid reflux'),
  ('Hydrochlorothiazide', 'For hypertension'),
  ('Amlodipine', 'For hypertension'),
  ('Gabapentin', 'For nerve pain')
ON CONFLICT (name) DO NOTHING;

-- Insert sample insurance plans
INSERT INTO insurance_plans (company_name, product_name, product_category, product_price, product_benefits, disqualifying_health_conditions, disqualifying_medications, available_states)
VALUES 
  ('Blue Cross', 'Premium Health', 'Health', 450.00, 'Comprehensive coverage with low deductible', ARRAY['Cancer', 'Heart Disease'], ARRAY['Insulin'], ARRAY['CA', 'NY', 'TX', 'FL']),
  ('Aetna', 'Basic Care', 'Health', 250.00, 'Affordable basic coverage', ARRAY['Cancer'], ARRAY[]::text[], ARRAY['CA', 'NY', 'TX', 'FL', 'WA', 'OR']),
  ('United Health', 'Family Plus', 'Health', 550.00, 'Family coverage with dental and vision', ARRAY[]::text[], ARRAY[]::text[], ARRAY['CA', 'NY', 'TX', 'FL', 'WA', 'OR', 'AZ']),
  ('Cigna', 'Senior Care', 'Medicare Supplement', 350.00, 'Comprehensive supplement for seniors', ARRAY['Cancer', 'Heart Disease', 'COPD'], ARRAY['Insulin', 'Gabapentin'], ARRAY['CA', 'NY', 'TX', 'FL', 'AZ']),
  ('Humana', 'Life Protect', 'Life', 120.00, '30-year term life insurance', ARRAY['Cancer', 'Heart Disease', 'Diabetes Type 1'], ARRAY['Insulin'], ARRAY['CA', 'NY', 'TX', 'FL', 'WA', 'OR', 'AZ', 'CO']),
  ('Prudential', 'Whole Life', 'Life', 200.00, 'Whole life coverage with investment component', ARRAY['Cancer'], ARRAY[]::text[], ARRAY['CA', 'NY', 'TX', 'FL', 'WA', 'OR', 'AZ', 'CO', 'NV']),
  ('MetLife', 'Dental Plus', 'Dental', 75.00, 'Comprehensive dental with orthodontics', ARRAY[]::text[], ARRAY[]::text[], ARRAY['CA', 'NY', 'TX', 'FL', 'WA', 'OR', 'AZ', 'CO', 'NV', 'UT']),
  ('Guardian', 'Vision Care', 'Vision', 45.00, 'Vision coverage with designer frames', ARRAY[]::text[], ARRAY[]::text[], ARRAY['CA', 'NY', 'TX', 'FL', 'WA', 'OR', 'AZ', 'CO', 'NV', 'UT']);

-- Enable row-level security
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE dependents ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own clients"
  ON clients FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own clients"
  ON clients FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own clients"
  ON clients FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own clients"
  ON clients FOR DELETE
  USING (auth.uid() = user_id);

-- Dependent policies
CREATE POLICY "Users can view their own dependents"
  ON dependents FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM clients
    WHERE clients.id = dependents.client_id
    AND clients.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert their own dependents"
  ON dependents FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM clients
    WHERE clients.id = dependents.client_id
    AND clients.user_id = auth.uid()
  ));

CREATE POLICY "Users can update their own dependents"
  ON dependents FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM clients
    WHERE clients.id = dependents.client_id
    AND clients.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete their own dependents"
  ON dependents FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM clients
    WHERE clients.id = dependents.client_id
    AND clients.user_id = auth.uid()
  ));

-- Public access to reference tables
ALTER TABLE health_conditions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access to health conditions"
  ON health_conditions FOR SELECT
  USING (true);

ALTER TABLE medications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access to medications"
  ON medications FOR SELECT
  USING (true);

ALTER TABLE insurance_plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access to insurance plans"
  ON insurance_plans FOR SELECT
  USING (true);

-- Add publication for realtime
alter publication supabase_realtime add table clients;
alter publication supabase_realtime add table dependents;
