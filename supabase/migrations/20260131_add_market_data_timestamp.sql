-- Add last_updated timestamp to skills_market_data table
-- This tracks when market intelligence data was last refreshed

DO $$
BEGIN
    -- Check if skills_market_data table exists
    IF EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = 'skills_market_data'
    ) THEN
        -- Add last_updated column if it doesn't exist
        IF NOT EXISTS (
            SELECT FROM information_schema.columns
            WHERE table_schema = 'public'
            AND table_name = 'skills_market_data'
            AND column_name = 'last_updated'
        ) THEN
            ALTER TABLE public.skills_market_data
            ADD COLUMN last_updated TIMESTAMP DEFAULT NOW();

            -- Update existing rows to have a timestamp
            UPDATE public.skills_market_data
            SET last_updated = NOW()
            WHERE last_updated IS NULL;
        END IF;
    END IF;
END $$;
