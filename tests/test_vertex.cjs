const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({
  vertexai: true
});

ai.models.generateContent({
  model: 'gemini-1.5-flash',
  contents: 'Hello'
}).then(res => console.log(res.text)).catch(console.error);
