import { createClient } from '@supabase/supabase-js'

// Pentru MVP, fara process.env - in Workers process poate sa nu existe si arunca eroare
// Cheia Publishable e safe to share publicly, o spune si Supabase, nu e secret
const supabaseUrl = 'https://kuzzkmldoklkwksokhd.supabase.co'
const supabaseAnonKey = 'sb_publishable_GXAymGCcwoDuVXtZACNdww_Kn1OkpvG'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)