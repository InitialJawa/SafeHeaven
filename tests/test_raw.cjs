const apiKey = process.env.GEMINI_API_KEY;

global.fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiKey}`
  },
  body: JSON.stringify({
    contents: [{ parts: [{ text: "Hello" }] }]
  })
}).then(res => res.json()).then(data => console.dir(data, {depth: null})).catch(console.error);
