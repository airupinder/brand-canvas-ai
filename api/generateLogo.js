export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST supported' });
  }

  const { context } = req.body;

  if (!context || context.trim() === '') {
    return res.status(400).json({ error: 'No context provided' });
  }

  try {
    // Build prompt for logo generation - keep logo minimalist, relevant to product, no text
    const prompt = `Minimalist logo design for a product described as: ${context}. No text, no words, no letters.`;

    // Encode prompt for Pollinations API
    const encodedPrompt = encodeURIComponent(prompt);

    // Pollinations API URL
    const pollinationsURL = `https://pollinations.ai/p/${encodedPrompt}`;

    // Respond quickly with image URL; frontend can just load this URL as an <img>
    return res.status(200).json({ imageUrl: pollinationsURL });
  } catch (error) {
    console.error('Logo generation error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
