document.getElementById('productForm').addEventListener('submit', async function(e) {
  e.preventDefault();

  const input = document.getElementById('productInput').value.trim();

  if (!input) {
    alert("Please enter a product launch command.");
    return;
  }

  // Reset outputs and show loading
  document.getElementById('brandColor').innerText = "Generating...";
  document.getElementById('colorSwatch').style.backgroundColor = "transparent";
  document.getElementById('brandFont').innerText = "Generating...";

  // Reference separate image containers
  const logoGrid = document.getElementById('logoGrid');
  const productGrid = document.getElementById('productGrid');
  const marketingGrid = document.getElementById('marketingGrid');

  // Clear previous images
  logoGrid.innerHTML = '';
  productGrid.innerHTML = '';
  marketingGrid.innerHTML = '';

  try {
    // Call Brand Color API
    const colorResponse = await fetch('/api/generateBrandColor', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ context: input }),
    });

    const colorData = await colorResponse.json();

    if (colorResponse.ok && colorData.colorHex) {
      document.getElementById('brandColor').innerText = colorData.colorHex;
      document.getElementById('colorSwatch').style.backgroundColor = colorData.colorHex;
    } else {
      document.getElementById('brandColor').innerText = colorData.error || "Failed to generate color.";
      document.getElementById('colorSwatch').style.backgroundColor = "transparent";
    }

    // Call Font Style API
    const fontResponse = await fetch('/api/generateFont', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ context: input }),
    });

    const fontData = await fontResponse.json();

    if (fontResponse.ok && fontData.font) {
      document.getElementById('brandFont').innerText = fontData.font;
    } else {
      document.getElementById('brandFont').innerText = fontData.error || "Failed to generate font.";
    }

    // Call Logo Generation API
    const logoResponse = await fetch('/api/generateLogo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ context: input }),
    });

    const logoData = await logoResponse.json();

    if (logoResponse.ok && logoData.imageUrl) {
      const wrapper = document.createElement('div');
      wrapper.className = 'image-wrapper';

      const img = document.createElement('img');
      img.src = logoData.imageUrl;
      img.alt = 'Generated Logo';

      wrapper.appendChild(img);
      logoGrid.appendChild(wrapper);
    } else {
      console.error("Logo generation failed:", logoData.error);
    }

    // Call Product Images API
    const productResponse = await fetch('/api/generateProductImages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ context: input }),
    });

    const productData = await productResponse.json();

    if (productResponse.ok && productData.imageUrls && productData.imageUrls.length > 0) {
      productData.imageUrls.forEach((url, idx) => {
        const wrapper = document.createElement('div');
        wrapper.className = 'image-wrapper';

        const img = document.createElement('img');
        img.src = url;
        img.alt = `Product Image ${idx + 1}`;

        wrapper.appendChild(img);
        productGrid.appendChild(wrapper);
      });
    } else {
      console.error("Product images generation failed:", productData.error);
    }

    // Call Marketing Image API
    const marketingResponse = await fetch('/api/generateMarketingImage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ context: input }),
    });

    const marketingData = await marketingResponse.json();

    if (marketingResponse.ok && marketingData.imageUrl) {
      const wrapper = document.createElement('div');
      wrapper.className = 'image-wrapper';

      const img = document.createElement('img');
      img.src = marketingData.imageUrl;
      img.alt = 'Marketing Image';

      wrapper.appendChild(img);
      marketingGrid.appendChild(wrapper);
    } else {
      console.error("Marketing image generation failed:", marketingData.error);
    }
  } catch (err) {
    document.getElementById('brandColor').innerText = "Error connecting to API.";
    document.getElementById('colorSwatch').style.backgroundColor = "transparent";
    document.getElementById('brandFont').innerText = "Error connecting to API.";
    console.error(err);
  }
});
