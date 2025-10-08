-- Add productivity columns to daily_entries table
ALTER TABLE public.daily_entries 
ADD COLUMN morning_productivity integer,
ADD COLUMN afternoon_productivity integer;