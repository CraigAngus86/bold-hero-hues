
// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://bbbxhwaixjjxgboeiktq.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJiYnhod2FpeGpqeGdib2Vpa3RxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI4MzA1NzMsImV4cCI6MjA1ODQwNjU3M30.ZZEenwbdq-bGlya3R2yvuspOlKMqkBp6tzC3TAdKGcQ";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
