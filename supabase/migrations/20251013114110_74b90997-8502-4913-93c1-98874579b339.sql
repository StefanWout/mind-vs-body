-- Add went_to_office column to daily_entries
ALTER TABLE public.daily_entries
ADD COLUMN went_to_office BOOLEAN;