-- Add pee_time column to daily_entries table
ALTER TABLE public.daily_entries 
ADD COLUMN pee_time time without time zone;