import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

if (!supabaseUrl || !supabaseAnonKey) {
    // Only throw in the browser or if actually trying to use it, to prevent build crashes
    if (typeof window !== "undefined") {
        throw new Error("Missing Supabase environment variables");
    }
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
