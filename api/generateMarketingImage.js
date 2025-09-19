export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST supported' });
  }

  const { context, brandName, marketingSlogan } = req.body;

  if (!context || !brandName || !marketingSlogan) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }

  try {
    const prompt = `Create a vibrant marketing image for the brand "${brandName}" with the slogan "${marketingSlogan}". Include a logo shape, relevant background representing the product "${context}", no text words or letters visible, only visual signs representing the logo and slogan.`;

    const encodedPrompt = encodeURIComponent(prompt);
    const pollinationsURL = `https://pollinations.ai/p/${encodedPrompt}`;

    return res.status(200).json({ imageUrl: pollinationsURL });
  } catch (error) {
    console.error('Marketing image generation error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
