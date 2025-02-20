import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing environment variables: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY must be defined')
}

// Add console logs to debug
console.log('Initializing Supabase client with:', {
  url: supabaseUrl,
  hasKey: !!supabaseAnonKey
})

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Test the connection
supabase.auth.getSession().then(
  () => console.log('Supabase connection successful'),
  (error) => console.error('Supabase connection failed:', error)
) 