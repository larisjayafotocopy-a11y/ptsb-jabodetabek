import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.https://xrwhnmljmhbdapzhwvfn.supabase.co;
const supabaseAnonKey = process.env.eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhyd2hubWxqbWhiZGFwemh3dmZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI3OTQ2NjQsImV4cCI6MjA5ODM3MDY2NH0.C4i8Y2yLFP_YuAMOaK2636xfNUVRiqOA2s45HtIJyPU;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
