import { createClient } from '@supabase/supabase-js'

// Daca process.env lipseste in Workers, folosim valorile publice ca fallback
// Cheia Publishable e safe to share publicly, nu e secret, o spune si Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://kuzzkmldoklkwksokhd.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_GXAymGCcwoDuVXZACNdww_Kn1OkpvG'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)