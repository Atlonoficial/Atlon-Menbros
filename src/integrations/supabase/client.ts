import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hvpoccaspebhvlihsauy.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh2cG9jY2FzcGViaHZsaWhzYXV5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIwMzQwMjAsImV4cCI6MjA3NzYxMDAyMH0.Ph-LK03uO9ctT58OOycrsO06xyzA_OOmJDgDqDDBH88';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);