export const ENV = {
    SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
    PERSIST_ENABLED: false,
    USE_FAKE_DATA: true, // ✅ force fake JSON for now
};


export const USING_SUPABASE = !!(ENV.SUPABASE_URL && ENV.SUPABASE_ANON_KEY) && !ENV.USE_FAKE_DATA;