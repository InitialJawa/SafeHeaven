const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

ai.models.generateContent({
  model: 'gemini-3.6-flash',
  contents: 'Hello, what is your name?'
}).then(res => {
  console.log('Output:', res.text);
}).catch(err => {
  console.error('Error:', err);
});
