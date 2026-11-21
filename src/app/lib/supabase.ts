import { createClient } from '@supabase/supabase-js'

// Fara process.env, in Workers process poate sa nu existe
// Cheia Publishable e safe to share publicly, nu e secret
const supabaseUrl = 'https://kuzzkmldoklkwksokhd.supabase.co'
const supabaseAnonKey = 'sb_publishable_GXAymGCcwoDuVXtZACNdww_Kn1OkpvG'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)