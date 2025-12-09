import { createClient } from '@supabase/supabase-js';

// Access environment variables properly
// In Figma Make, you need to set these in your project settings
const supabaseUrl = import.meta.env?.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env?.VITE_SUPABASE_ANON_KEY || '';

// For development/testing, you can temporarily hardcode your values here:
// const supabaseUrl = 'https://your-project-id.supabase.co';
// const supabaseAnonKey = 'your-anon-key-here';

// Validate that we have the required environment variables
if (!supabaseUrl || !supabaseAnonKey || supabaseUrl === 'https://placeholder.supabase.co') {
  console.warn('⚠️ SUPABASE NOT CONFIGURED ⚠️');
  console.warn('Please set your Supabase credentials in one of two ways:');
  console.warn('1. Uncomment and fill in the hardcoded values above (lines 7-8)');
  console.warn('2. Or set environment variables in your deployment platform');
  console.warn('Get your credentials from: https://app.supabase.com/project/_/settings/api');
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co', 
  supabaseAnonKey || 'placeholder-key'
);