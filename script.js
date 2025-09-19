document.getElementById('productForm').addEventListener('submit', async function(e) {
  e.preventDefault();

  const input = document.getElementById('productInput').value.trim();

  if (!input) {
    alert("Please enter a product launch command.");
    return;
  }

  // Show loading or reset outputs
  document.getElementById('brandColor').innerText = "Generating...";
  document.getElementById('colorSwatch').style.backgroundColor = "transparent";

  try {
    const response = await fetch('/api/generateBrandColor', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ context: input }),
    });

    const data = await response.json();

    if (response.ok && data.colorHex) {
      document.getElementById('brandColor').innerText = data.colorHex;
      document.getElementById('colorSwatch').style.backgroundColor = data.colorHex;
    } else {
      document.getElementById('brandColor').innerText = data.error || "Failed to generate color.";
      document.getElementById('colorSwatch').style.backgroundColor = "transparent";
    }
  } catch (err) {
    document.getElementById('brandColor').innerText = "Error connecting to API.";
    document.getElementById('colorSwatch').style.backgroundColor = "transparent";
    console.error(err);
  }
});
