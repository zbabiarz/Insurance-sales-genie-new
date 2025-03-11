-- Add gender field to clients table
ALTER TABLE clients
ADD COLUMN IF NOT EXISTS gender TEXT;

-- Add gender field to dependents table
ALTER TABLE dependents
ADD COLUMN IF NOT EXISTS gender TEXT;
