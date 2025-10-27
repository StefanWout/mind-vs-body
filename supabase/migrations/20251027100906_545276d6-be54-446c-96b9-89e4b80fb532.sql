-- Add gym tracking fields to daily_entries table
ALTER TABLE public.daily_entries 
ADD COLUMN went_to_gym boolean,
ADD COLUMN gym_intensity integer CHECK (gym_intensity >= 1 AND gym_intensity <= 5);