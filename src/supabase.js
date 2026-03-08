import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://tqqqwpigfptdjkmbieol.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRxcXF3cGlnZnB0ZGprbWJpZW9sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI5ODUzNzUsImV4cCI6MjA4ODU2MTM3NX0.gT1m_GM-CXfIa825n4V1YFvcMFwj13kjtc7tF86Voho";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
