import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://kuzzkmldoklkwksokhd.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt1enprbWxkbG9rbHdrd3Nva2hkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTUyODc2MTYsImV4cCI6MjExMDg2MzYxNn0.qtVQYlMzAnMb_1kTuINF37oKRjG2AvOEdUSDFlFggHw'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)