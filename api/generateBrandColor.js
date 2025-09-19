export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST supported' });
  }

  const { context } = req.body;

  if (!context || context.trim() === '') {
    return res.status(400).json({ error: 'No context provided' });
  }

  try {
    // Use OpenAI Chat API to generate a brand color hex code based on brand theory
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are an expert brand consultant generating a visually appealing HEX color code that represents a product brand based on the product description.',
          },
          {
            role: 'user',
            content: `Suggest a single HEX color code for a product with this description:\n${context}\nGive only the HEX color code (e.g. #1A2B3C) with a short explanation.`,
          },
        ],
        max_tokens: 100,
      }),
    });

    const json = await openaiResponse.json();

    if (!openaiResponse.ok) {
      return res.status(openaiResponse.status).json(json);
    }

    const text = json.choices[0].message.content;

    // Extract hex color code (regex for # followed by 3 or 6 hex digits)
    const hexMatch = text.match(/#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})/);

    if (!hexMatch) {
      return res.status(500).json({ error: 'No HEX color code found in API response.' });
    }

    return res.status(200).json({ colorHex: hexMatch[0], explanation: text });
  } catch (error) {
    console.error('Brand color generation error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
