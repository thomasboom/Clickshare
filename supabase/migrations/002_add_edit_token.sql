-- Add edit_token column to profiles table
ALTER TABLE public.profiles
ADD COLUMN edit_token TEXT UNIQUE;
