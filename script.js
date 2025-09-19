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
      document.getElementById('brandFont').
