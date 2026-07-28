const apiKey = process.env.GEMINI_API_KEY;

global.fetch('https://aistudio.google.com/api/v1beta/models/gemini-3.6-flash:generateContent', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiKey}`
  },
  body: JSON.stringify({
    contents: [{ parts: [{ text: "Hello" }] }]
  })
}).then(res => res.text()).then(console.log).catch(console.error);
