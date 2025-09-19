export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST supported' });
  }

  const { context } = req.body;

  if (!context || context.trim() === '') {
    return res.status(400).json({ error: 'No context provided' });
  }

  try {
    // Prompt for a simple marketing image, text-free, theme relevant to product
    const prompt = `Simple, clean marketing image representing product: ${context}. No text, no letters, no words.`;

    const encodedPrompt = encodeURIComponent(prompt);

    const pollinationsURL = `https://pollinations.ai/p/${encodedPrompt}`;

    res.status(200).json({ imageUrl: pollinationsURL });
  } catch (error) {
    console.error('Marketing image generation error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
