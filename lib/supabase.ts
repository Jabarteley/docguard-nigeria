
import { createClient } from '@supabase/supabase-js';

// Fallback values prevent the 'supabaseUrl is required' crash if environment variables aren't provided yet
import { Secrets } from "../src/config/secrets";

// Use encrypted secrets for Supabase connection
const supabaseUrl = Secrets.SUPABASE_URL;
const supabaseAnonKey = Secrets.SUPABASE_ANON_KEY;

export const isSupabaseConfigured = !!supabaseUrl && !!supabaseAnonKey;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface SupabaseLoan {
  id: string;
  borrower_name: string;
  amount: number;
  currency: string;
  status: string;
  type: string;
  deadline: string;
  cac_registration_status: string;
  created_at?: string;
  user_id?: string;
}

export interface SupabaseDocument {
  id?: string;
  loan_id: string;
  content: string;
  version: number;
  template_name?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  read: boolean;
  created_at: string;
}
