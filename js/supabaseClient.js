import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://bkhfavdsqcludugeiikc.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJraGZhdmRzcWNsdWR1Z2VpaWtjIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODUzOTA3NTQsImV4cCI6MjAwMDk2Njc1NH0.cSb_uPGt-XNUVn1lO2VYVnYyNCqdPjZcM-WRaT_XekI'

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

export default supabase;