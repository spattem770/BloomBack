import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from '/utils/supabase/info';

const supabaseUrl = `https://${projectId}.supabase.co`;

// Create a singleton Supabase client for the browser
export const supabase = createClient(supabaseUrl, publicAnonKey);

// API base URL for server functions
export const API_BASE_URL = `${supabaseUrl}/functions/v1/server`;