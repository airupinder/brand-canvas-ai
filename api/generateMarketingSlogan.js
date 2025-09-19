export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST supported' });
  }
  const { context } = req.body;
  if (!context || context.trim() === '') {
    return res.status(400).json({ error: 'No context provided' });
  }
  try {
    const prompt = `Create a short, catchy marketing slogan for a product described as:\n${context}\nOnly the slogan, no extra text.`;
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: 'You are a creative marketing specialist.' },
          { role: 'user', content: prompt },
        ],
        max_tokens: 50,
      }),
    });
    const json = await openaiResponse.json();
    if (!openaiResponse.ok) {
      return res.status(openaiResponse.status).json(json);
    }
    const slogan = json.choices[0].message.content.trim();
    return res.status(200).json({ slogan });
  } catch (error) {
    console.error('Slogan generation error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
