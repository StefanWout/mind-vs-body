-- Add notes column to daily_entries table
ALTER TABLE public.daily_entries 
ADD COLUMN notes text;