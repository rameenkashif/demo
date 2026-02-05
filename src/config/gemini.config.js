// Gemini AI configuration
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

// Debug: Check if API key is loaded
console.log('🔑 Gemini API Key Status:', apiKey ? `Loaded (${apiKey.substring(0, 10)}...)` : '❌ MISSING');

const geminiConfig = {
    apiKey: apiKey || ""
};

// Validate environment variable
if (!geminiConfig.apiKey) {
    console.error('❌ Missing Gemini API key in .env file!');
    console.error('Add: VITE_GEMINI_API_KEY=your_api_key_here');
    console.error('Then restart the dev server: npm run dev');
}

export default geminiConfig;
