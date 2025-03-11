-- Create user_activity table to track actions and calculate time saved
CREATE TABLE IF NOT EXISTS public.user_activity (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    activity_type TEXT NOT NULL,
    details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_user_activity_user_id ON public.user_activity(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activity_type ON public.user_activity(activity_type);
CREATE INDEX IF NOT EXISTS idx_user_activity_created_at ON public.user_activity(created_at);

-- Enable RLS
ALTER TABLE public.user_activity ENABLE ROW LEVEL SECURITY;

-- Create policies
DROP POLICY IF EXISTS "Users can view their own activity" ON public.user_activity;
CREATE POLICY "Users can view their own activity"
    ON public.user_activity FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own activity" ON public.user_activity;
CREATE POLICY "Users can insert their own activity"
    ON public.user_activity FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Add function to log user activity
CREATE OR REPLACE FUNCTION log_user_activity(p_user_id UUID, p_activity_type TEXT, p_details JSONB DEFAULT NULL)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_activity_id UUID;
BEGIN
    INSERT INTO public.user_activity (user_id, activity_type, details)
    VALUES (p_user_id, p_activity_type, p_details)
    RETURNING id INTO v_activity_id;
    
    RETURN v_activity_id;
END;
$$;

-- Add sample data for testing
INSERT INTO public.user_activity (user_id, activity_type, details, created_at)
SELECT 
    id,
    CASE floor(random() * 4)
        WHEN 0 THEN 'client_intake'
        WHEN 1 THEN 'ai_chat'
        WHEN 2 THEN 'call_analysis'
        WHEN 3 THEN 'plan_match'
    END,
    jsonb_build_object('sample', true),
    NOW() - (random() * interval '30 days')
FROM 
    auth.users
WHERE 
    EXISTS (SELECT 1 FROM auth.users LIMIT 1)
LIMIT 20;
