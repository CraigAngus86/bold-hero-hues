
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
export const supabase = createClient(
  'https://bbbxhwaixjjxgboeiktq.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJiYnhod2FpeGpqeGdib2Vpa3RxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI4MzA1NzMsImV4cCI6MjA1ODQwNjU3M30.ZZEenwbdq-bGlya3R2yvuspOlKMqkBp6tzC3TAdKGcQ'
);
