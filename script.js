document.getElementById('productForm').addEventListener('submit', async function(e) {
  e.preventDefault();

  const input = document.getElementById('productInput').value.trim();

  if (!input) {
    alert("Please enter a product launch command.");
    return;
  }

  // Reset outputs and show loading
  document.getElementById('brandName').innerText = "Generating...";
  document.getElementById('brandColor').innerText = "Generating...";
  document.getElementById('colorSwatch').style.backgroundColor = "transparent";
  document.getElementById('brandFont').innerText = "Generating...";
  document.getElementById('marketingSlogan').innerText = "Generating...";

  const logoGrid = document.getElementById('logoGrid');
  const productGrid = document.getElementById('productGrid');
  const marketingGrid = document.getElementById('marketingGrid');

  logoGrid.innerHTML = '';
  productGrid.innerHTML = '';
  marketingGrid.innerHTML = '';

  try {
    // Brand Name API
    const brandNameResp = await fetch('/api/generateBrandName', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ context: input }),
    });
    const brandNameData = await brandNameResp.json();
    const brandName = brandNameResp.ok ? brandNameData.brandName : null;

    if (brandName) {
      document.getElementById('brandName').innerText = brandName;
    } else {
      document.getElementById('brandName').innerText = brandNameData.error || "Failed to generate brand name.";
    }

    // Brand Color API
    const colorResp = await fetch('/api/generateBrandColor', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ context: input }),
    });
    const colorData = await colorResp.json();
    if (colorResp.ok && colorData.colorHex) {
      document.getElementById('brandColor').innerText = colorData.colorHex;
      document.getElementById('colorSwatch').style.backgroundColor = colorData.colorHex;
    } else {
      document.getElementById('brandColor').innerText = colorData.error || "Failed to generate color.";
      document.getElementById('colorSwatch').style.backgroundColor = "transparent";
    }

    // Font Style API
    const fontResp = await fetch('/api/generateFont', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ context: input }),
    });
    const fontData = await fontResp.json();
    if (fontResp.ok && fontData.font) {
      document.getElementById('brandFont').innerText = fontData.font;
    } else {
      document.getElementById('brandFont').innerText = fontData.error || "Failed to generate font.";
    }

    // Logo API
    const logoResp = await fetch('/api/generateLogo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ context: input }),
    });
    const logoData = await logoResp.json();
    if (logoResp.ok && logoData.imageUrl) {
      const wrapper = document.createElement('div');
      wrapper.className = 'image-wrapper';
      const img = document.createElement('img');
      img.src = logoData.imageUrl;
      img.alt = 'Generated Logo';
      wrapper.appendChild(img);
      logoGrid.appendChild(wrapper);
    }

    // Product Images API
    const productResp = await fetch('/api/generateProductImages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ context: input }),
    });
    const productData = await productResp.json();
    if (productResp.ok && productData.imageUrls?.length > 0) {
      productData.imageUrls.forEach((url, idx) => {
        const wrapper = document.createElement('div');
        wrapper.className = 'image-wrapper';
        const img = document.createElement('img');
        img.src = url;
        img.alt = `Product Image ${idx + 1}`;
        wrapper.appendChild(img);
        productGrid.appendChild(wrapper);
      });
    }

    // Marketing Slogan API
    const sloganResp = await fetch('/api/generateMarketingSlogan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ context: input }),
    });
    const sloganData = await sloganResp.json();
    const marketingSlogan = sloganResp.ok ? sloganData.slogan : null;

    if (marketingSlogan) {
      document.getElementById('marketingSlogan').innerText = marketingSlogan;
    } else {
      document.getElementById('marketingSlogan').innerText = sloganData.error || "Failed to generate marketing slogan.";
    }

    // Marketing Image API with brand name and slogan
    if (brandName && marketingSlogan) {
      const marketingResp = await fetch('/api/generateMarketingImage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ context: input, brandName, marketingSlogan }),
      });
      const marketingData = await marketingResp.json();
      if (marketingResp.ok && marketingData.imageUrl) {
        const wrapper = document.createElement('div');
        wrapper.className = 'image-wrapper';
        const img = document.createElement('img');
        img.src = marketingData.imageUrl;
        img.alt = 'Marketing Image';
        wrapper.appendChild(img);
        marketingGrid.appendChild(wrapper);
      }
    }
  } catch (error) {
    console.error('Error in generation:', error);
    document.getElementById('brandName').innerText = "Error connecting to API.";
    document.getElementById('brandColor').innerText = "Error connecting to API.";
    document.getElementById('brandFont').innerText = "Error connecting to API.";
    document.getElementById('marketingSlogan').innerText = "Error connecting to API.";
  }
});

document.getElementById('downloadAllBtn').addEventListener('click', async () => {
  const zip = new JSZip();

  // Collect all images from logo, product, marketing grids
  const allImages = [
    ...document.querySelectorAll('#logoGrid img'),
    ...document.querySelectorAll('#productGrid img'),
    ...document.querySelectorAll('#marketingGrid img')
  ];

  if (allImages.length === 0) {
    alert("No images to download.");
    return;
  }

  // Fetch each image then add to zip
  const fetchAndAddToZip = async (imgElem, index) => {
    try {
      const url = imgElem.src;
      const response = await fetch(url);
      const blob = await response.blob();

      // Get file extension from URL
      const extMatch = url.match(/\.(jpg|jpeg|png|gif|webp)(\?|$)/i);
      const ext = extMatch ? extMatch[1] : 'png';

      // Name files with type and index
      let prefix = 'image';
      if (imgElem.closest('#logoGrid')) prefix = 'logo';
      else if (imgElem.closest('#productGrid')) prefix = 'product';
      else if (imgElem.closest('#marketingGrid')) prefix = 'marketing';

      zip.file(`${prefix}_${index + 1}.${ext}`, blob);
    } catch (e) {
      console.error('Error fetching image for zip:', e);
    }
  };

  await Promise.all(allImages.map(fetchAndAddToZip));

  // Generate and save the ZIP
  zip.generateAsync({ type: 'blob' }).then(content => {
    saveAs(content, 'brand_canvas_images.zip');
  });
});
