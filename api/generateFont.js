export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST supported' });
  }

  const { context } = req.body;

  if (!context || context.trim() === '') {
    return res.status(400).json({ error: 'No context provided' });
  }

  try {
    // Call OpenAI Chat API to get font name suggestion
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
            content: 'You are a creative branding expert suggesting a brand font style for new product launches.',
          },
          {
            role: 'user',
            content: `For a product described as:\n${context}\nSuggest a single font style (e.g., "Modern Sans Serif", "Elegant Serif", "Handwritten", "Minimalist"), keep it short and clear.`,
          },
        ],
        max_tokens: 30,
      }),
    });

    const json = await openaiResponse.json();

    if (!openaiResponse.ok) {
      return res.status(openaiResponse.status).json(json);
    }

    const fontSuggestion = json.choices[0].message.content.trim();

    return res.status(200).json({ font: fontSuggestion });
  } catch (error) {
    console.error('Font generation error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
