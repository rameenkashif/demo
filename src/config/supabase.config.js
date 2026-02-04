// Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
    console.error('❌ Missing Supabase credentials in .env file!');
    console.error('Make sure you have:');
    console.error('VITE_SUPABASE_URL=https://your-project.supabase.co');
    console.error('VITE_SUPABASE_ANON_KEY=your_anon_key');
    console.error('Then restart the dev server: npm run dev');
}

const supabaseConfig = {
    url: supabaseUrl || "",
    anonKey: supabaseAnonKey || ""
};

export default supabaseConfig;
