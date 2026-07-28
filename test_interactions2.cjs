const { GoogleGenAI } = require('@google/genai');

const apiKey = process.env.GEMINI_API_KEY;
const isBearer = apiKey.startsWith('AQ.');

if (isBearer) delete process.env.GEMINI_API_KEY;

const ai = new GoogleGenAI({
  httpOptions: {
    headers: isBearer ? { Authorization: `Bearer ${apiKey}` } : {}
  }
});

if (isBearer) process.env.GEMINI_API_KEY = apiKey;

ai.interactions.create({
  model: 'gemini-3.6-flash',
  input: 'Hello, what is your name?'
}).then(res => {
  console.log('Interactions output:', res.output_text);
}).catch(err => {
  console.error('Error:', err);
});
