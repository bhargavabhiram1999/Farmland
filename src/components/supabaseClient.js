import { createClient } from '@supabase/supabase-js';

// Replace these with your Supabase project credentials
const SUPABASE_URL = 'https://igloolnzmrqglfvzulyn.supabase.co';  // Replace with your Supabase URL
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlnbG9vbG56bXJxZ2xmdnp1bHluIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA1MDA0MTMsImV4cCI6MjA1NjA3NjQxM30.eQVJoMWJvP-BVXnmfuAZMSKxqFmptk3agQJCN-r8ztw'; // Replace with your Supabase Anon Key

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default supabase;
