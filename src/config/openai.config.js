// OpenAI configuration
const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

// Debug: Check if API key is loaded
console.log('🔑 OpenAI API Key Status:', apiKey ? `Loaded (${apiKey.substring(0, 10)}...)` : '❌ MISSING');

const openaiConfig = {
    apiKey: apiKey || ""
};

// Validate environment variable
if (!openaiConfig.apiKey) {
    console.error('❌ Missing OpenAI API key in .env file!');
    console.error('Add: VITE_OPENAI_API_KEY=your_api_key_here');
    console.error('Then restart the dev server: npm run dev');
}

export default openaiConfig;
