-- Add priority column to skills_market_data table
-- Priority is based on skill frequency: High (60%+), Medium (30-60%), Low (<30%)

DO $$
BEGIN
    -- Check if skills_market_data table exists
    IF EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = 'skills_market_data'
    ) THEN
        -- Add priority column if it doesn't exist
        IF NOT EXISTS (
            SELECT FROM information_schema.columns
            WHERE table_schema = 'public'
            AND table_name = 'skills_market_data'
            AND column_name = 'priority'
        ) THEN
            ALTER TABLE public.skills_market_data
            ADD COLUMN priority TEXT CHECK (priority IN ('High', 'Medium', 'Low'));

            -- Update existing rows based on frequency_percentage
            UPDATE public.skills_market_data
            SET priority = CASE
                WHEN frequency_percentage >= 60 THEN 'High'
                WHEN frequency_percentage >= 30 THEN 'Medium'
                ELSE 'Low'
            END
            WHERE priority IS NULL;
        END IF;
    END IF;
END $$;
