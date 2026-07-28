const { GoogleGenAI } = require('@google/genai');

const apiKey = process.env.GEMINI_API_KEY;
const isBearer = apiKey.startsWith('AQ.');

// Remove it so SDK doesn't read it
if (isBearer) delete process.env.GEMINI_API_KEY;

const ai = new GoogleGenAI({
  httpOptions: {
    headers: isBearer ? { Authorization: `Bearer ${apiKey}` } : {}
  }
});

// Restore it
if (isBearer) process.env.GEMINI_API_KEY = apiKey;

const originalFetch = global.fetch;
global.fetch = async (url, options) => {
  console.log('Fetching URL:', url);
  console.log('Headers:', options.headers);
  return originalFetch(url, options);
};

ai.models.generateContent({
  model: 'gemini-2.5-flash',
  contents: 'Hello'
}).then(res => {
  console.log(res.text);
}).catch(err => {
  console.error('Error Status:', err.status);
  console.error(err);
});
