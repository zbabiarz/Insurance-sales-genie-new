-- Add sample client data if none exists
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM clients LIMIT 1) THEN
        -- Get a user ID to associate with the sample clients
        DECLARE
            sample_user_id UUID;
        BEGIN
            -- Try to get an existing user ID
            SELECT id INTO sample_user_id FROM auth.users LIMIT 1;
            
            -- If no user exists, we'll use a placeholder UUID
            IF sample_user_id IS NULL THEN
                sample_user_id := '00000000-0000-0000-0000-000000000000'::UUID;
            END IF;
            
            -- Insert sample clients
            INSERT INTO clients (id, user_id, full_name, gender, date_of_birth, state, zip_code, height, weight, health_conditions, medications, created_at)
            VALUES
                (gen_random_uuid(), sample_user_id, 'John Smith', 'male', '1975-06-15', 'CA', '90210', 70, 180, ARRAY['Hypertension', 'Asthma']::text[], ARRAY['Lisinopril']::text[], NOW() - INTERVAL '30 days'),
                (gen_random_uuid(), sample_user_id, 'Sarah Johnson', 'female', '1982-03-22', 'NY', '10001', 65, 140, ARRAY['Anxiety']::text[], ARRAY['Omeprazole']::text[], NOW() - INTERVAL '25 days'),
                (gen_random_uuid(), sample_user_id, 'Michael Rodriguez', 'male', '1968-11-07', 'TX', '75001', 72, 195, ARRAY['Diabetes']::text[], ARRAY['Metformin', 'Insulin']::text[], NOW() - INTERVAL '20 days'),
                (gen_random_uuid(), sample_user_id, 'Emily Chen', 'female', '1990-08-12', 'WA', '98101', 63, 125, ARRAY[]::text[], ARRAY[]::text[], NOW() - INTERVAL '15 days'),
                (gen_random_uuid(), sample_user_id, 'Robert Williams', 'male', '1955-02-28', 'FL', '33101', 68, 210, ARRAY['Heart Disease', 'Hypertension']::text[], ARRAY['Atorvastatin', 'Lisinopril']::text[], NOW() - INTERVAL '10 days');
            
            -- Get the IDs of the clients we just inserted
            DECLARE
                john_id UUID;
                sarah_id UUID;
                michael_id UUID;
                emily_id UUID;
                robert_id UUID;
            BEGIN
                SELECT id INTO john_id FROM clients WHERE full_name = 'John Smith' LIMIT 1;
                SELECT id INTO sarah_id FROM clients WHERE full_name = 'Sarah Johnson' LIMIT 1;
                SELECT id INTO michael_id FROM clients WHERE full_name = 'Michael Rodriguez' LIMIT 1;
                SELECT id INTO emily_id FROM clients WHERE full_name = 'Emily Chen' LIMIT 1;
                SELECT id INTO robert_id FROM clients WHERE full_name = 'Robert Williams' LIMIT 1;
                
                -- Insert dependents for some clients
                INSERT INTO dependents (id, client_id, full_name, gender, date_of_birth, relationship, health_conditions, medications)
                VALUES
                    -- John's dependents
                    (gen_random_uuid(), john_id, 'Mary Smith', 'female', '1980-09-20', 'spouse', ARRAY[]::text[], ARRAY[]::text[]),
                    (gen_random_uuid(), john_id, 'Jake Smith', 'male', '2010-04-10', 'child', ARRAY['Asthma']::text[], ARRAY['Albuterol']::text[]),
                    (gen_random_uuid(), john_id, 'Emma Smith', 'female', '2012-07-22', 'child', ARRAY[]::text[], ARRAY[]::text[]),
                    
                    -- Sarah's dependents
                    (gen_random_uuid(), sarah_id, 'David Johnson', 'male', '1980-11-15', 'spouse', ARRAY['Hypertension']::text[], ARRAY['Amlodipine']::text[]),
                    
                    -- Michael's dependents
                    (gen_random_uuid(), michael_id, 'Lisa Rodriguez', 'female', '1970-05-18', 'spouse', ARRAY[]::text[], ARRAY[]::text[]),
                    (gen_random_uuid(), michael_id, 'Carlos Rodriguez', 'male', '2005-12-03', 'child', ARRAY[]::text[], ARRAY[]::text[]),
                    (gen_random_uuid(), michael_id, 'Sofia Rodriguez', 'female', '2008-02-14', 'child', ARRAY[]::text[], ARRAY[]::text[]),
                    
                    -- Robert's dependents
                    (gen_random_uuid(), robert_id, 'Patricia Williams', 'female', '1958-06-10', 'spouse', ARRAY['Depression']::text[], ARRAY[]::text[]);
            END;
        END;
    END IF;
END $$;