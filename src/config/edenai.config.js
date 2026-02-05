// Eden AI configuration
const apiKey = import.meta.env.VITE_EDENAI_API_KEY;

// Debug: Check if API key is loaded
console.log('🔑 Eden AI API Key Status:', apiKey ? `Loaded (${apiKey.substring(0, 20)}...)` : '❌ MISSING');

const edenaiConfig = {
    apiKey: apiKey || "",
    baseUrl: "https://api.edenai.run/v2"
};

// Validate environment variable
if (!edenaiConfig.apiKey) {
    console.error('❌ Missing Eden AI API key in .env file!');
    console.error('Add: VITE_EDENAI_API_KEY=your_api_key_here');
    console.error('Then restart the dev server: npm run dev');
}

export default edenaiConfig;
