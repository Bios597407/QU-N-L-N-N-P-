import { createClient } from '@supabase/supabase-js';

const defaultUrl = 'https://ziizirpucnapapgbfskw.supabase.co';
const defaultKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InppaXppcnB1Y25hcGFwZ2Jmc2t3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTEyOTY3ODcsImV4cCI6MjEwNjg3Mjc4N30.0ZLP3X44OvFY74MjGeGelmqi43IwT7brHHgC0oFG22Y';

const envUrl = import.meta.env.VITE_SUPABASE_URL || defaultUrl;
const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY || defaultKey;

const localUrl = typeof window !== 'undefined' ? localStorage.getItem('CUSTOM_SUPABASE_URL') : null;
const localKey = typeof window !== 'undefined' ? localStorage.getItem('CUSTOM_SUPABASE_KEY') : null;

const rawUrl = localUrl || envUrl;
export const effectiveUrl = rawUrl ? rawUrl.replace(/\/rest\/v1\/?$/, '').replace(/\/+$/, '') : '';
export const effectiveKey = localKey || envKey || '';

export const isSupabaseConfigured = Boolean(
  effectiveUrl &&
  effectiveKey &&
  effectiveUrl !== 'https://your-project.supabase.co' &&
  !effectiveUrl.includes('placeholder')
);

export const supabase = isSupabaseConfigured && effectiveUrl && effectiveKey
  ? createClient(effectiveUrl, effectiveKey)
  : null;
