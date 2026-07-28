const { GoogleGenAI } = require('@google/genai');
const ai = new GoogleGenAI({}); // It will automatically read process.env.GEMINI_API_KEY

ai.interactions.create({
  model: 'gemini-2.5-flash',
  input: 'Hello, what is your name?'
}).then(res => {
  console.log('Interactions output:', res.output_text);
}).catch(err => {
  console.error('Error:', err);
});
