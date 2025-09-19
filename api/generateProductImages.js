export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST supported' });
  }

  const { context } = req.body;

  if (!context || context.trim() === '') {
    return res.status(400).json({ error: 'No context provided' });
  }

  try {
    // Prepare prompts for two product images
    const prompt1 = `Minimalist product image representing: ${context}, no text, no letters, no words.`;
    const prompt2 = `Creative, simple illustration of product described as: ${context}, no words, no letters, flat design.`;

    // Generate Pollinations URLs
    const imageUrl1 = `https://pollinations.ai/p/${encodeURIComponent(prompt1)}`;
    const imageUrl2 = `https://pollinations.ai/p/${encodeURIComponent(prompt2)}`;

    // Respond with both image URLs
    res.status(200).json({ imageUrls: [imageUrl1, imageUrl2] });
  } catch (error) {
    console.error('Product images generation error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
