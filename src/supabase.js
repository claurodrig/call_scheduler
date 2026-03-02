import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://kqetdgoxqqibptoaarnc.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtxZXRkZ294cXFpYnB0b2Fhcm5jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI0MDcxMjgsImV4cCI6MjA4Nzk4MzEyOH0.G5eMbVhFLEhtowMZW-I0p6O-He4KsNlObjeQ1GaNnAo";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);