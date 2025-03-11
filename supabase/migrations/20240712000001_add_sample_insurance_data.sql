-- Add sample insurance plans if they don't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM insurance_plans LIMIT 1) THEN
        -- Add sample insurance plans
        INSERT INTO insurance_plans (id, company_name, product_name, product_category, product_price, product_benefits, available_states, disqualifying_health_conditions, disqualifying_medications)
        VALUES
          (gen_random_uuid(), 'BlueCross', 'Premium Health', 'Health', 450, 'Comprehensive coverage including dental and vision', ARRAY['CA', 'NY', 'TX']::text[], ARRAY['Cancer', 'Heart Disease']::text[], ARRAY['Insulin']::text[]),
          (gen_random_uuid(), 'BlueCross', 'Basic Care', 'Health', 250, 'Basic health coverage without dental and vision', ARRAY['CA', 'NY', 'TX', 'FL']::text[], ARRAY['Cancer']::text[], ARRAY[]::text[]),
          (gen_random_uuid(), 'LifeShield', 'Term Life 20', 'Life', 75, '20-year term life insurance with fixed premiums', ARRAY['CA', 'NY', 'TX', 'FL', 'WA']::text[], ARRAY['Cancer', 'Heart Disease', 'Diabetes']::text[], ARRAY['Insulin', 'Metformin']::text[]),
          (gen_random_uuid(), 'LifeShield', 'Whole Life', 'Life', 150, 'Lifetime coverage with cash value accumulation', ARRAY['CA', 'NY', 'TX', 'FL', 'WA']::text[], ARRAY['Cancer']::text[], ARRAY[]::text[]),
          (gen_random_uuid(), 'MediCare Plus', 'Senior Complete', 'Medicare Supplement', 200, 'Comprehensive Medicare supplement with prescription coverage', ARRAY['CA', 'NY', 'FL']::text[], ARRAY[]::text[], ARRAY[]::text[]),
          (gen_random_uuid(), 'MediCare Plus', 'Basic Supplement', 'Medicare Supplement', 120, 'Basic Medicare supplement plan', ARRAY['CA', 'NY', 'TX', 'FL', 'WA']::text[], ARRAY[]::text[], ARRAY[]::text[]),
          (gen_random_uuid(), 'FamilyCare', 'Family Shield', 'Health', 550, 'Family plan with coverage for up to 5 dependents', ARRAY['CA', 'NY', 'TX']::text[], ARRAY['Cancer']::text[], ARRAY['Insulin']::text[]),
          (gen_random_uuid(), 'FamilyCare', 'Couples Care', 'Health', 380, 'Health coverage optimized for couples', ARRAY['CA', 'NY', 'TX', 'FL']::text[], ARRAY[]::text[], ARRAY[]::text[]);
    END IF;

    -- Add sample health conditions if they don't exist
    IF NOT EXISTS (SELECT 1 FROM health_conditions LIMIT 1) THEN
        INSERT INTO health_conditions (id, name, description)
        VALUES
          (gen_random_uuid(), 'Diabetes', 'Type 1 or Type 2 diabetes'),
          (gen_random_uuid(), 'Hypertension', 'High blood pressure'),
          (gen_random_uuid(), 'Asthma', 'Chronic respiratory condition'),
          (gen_random_uuid(), 'Heart Disease', 'Various conditions affecting the heart'),
          (gen_random_uuid(), 'Cancer', 'History of any type of cancer'),
          (gen_random_uuid(), 'Obesity', 'BMI of 30 or higher'),
          (gen_random_uuid(), 'Anxiety', 'Generalized anxiety disorder'),
          (gen_random_uuid(), 'Depression', 'Clinical depression');
    END IF;

    -- Add sample medications if they don't exist
    IF NOT EXISTS (SELECT 1 FROM medications LIMIT 1) THEN
        INSERT INTO medications (id, name, description)
        VALUES
          (gen_random_uuid(), 'Metformin', 'For diabetes management'),
          (gen_random_uuid(), 'Lisinopril', 'For hypertension'),
          (gen_random_uuid(), 'Atorvastatin', 'For cholesterol management'),
          (gen_random_uuid(), 'Albuterol', 'For asthma'),
          (gen_random_uuid(), 'Levothyroxine', 'For thyroid conditions'),
          (gen_random_uuid(), 'Insulin', 'For diabetes management'),
          (gen_random_uuid(), 'Omeprazole', 'For acid reflux'),
          (gen_random_uuid(), 'Hydrochlorothiazide', 'For hypertension'),
          (gen_random_uuid(), 'Amlodipine', 'For hypertension'),
          (gen_random_uuid(), 'Gabapentin', 'For nerve pain and seizures');
    END IF;
END $$;