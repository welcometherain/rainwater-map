// script.js
async function getRainfall() {
  const zip = document.getElementById("zip").value;
  if (!zip) return alert("Please enter a ZIP code.");

  try {
    // Get Lat/Lon from ZIP
    const zipRes = await fetch(`https://api.zippopotam.us/us/${zip}`);
    if (!zipRes.ok) throw new Error("ZIP not found");
    const zipData = await zipRes.json();
    const lat = zipData.places[0].latitude;
    const lon = zipData.places[0].longitude;

    // Get Climate data from Open-Meteo
    const climateRes = await fetch(`https://climate-api.open-meteo.com/v1/climate?latitude=${lat}&longitude=${lon}&start_year=1991&end_year=2020&models=ERA5`);
    const climateData = await climateRes.json();
    const monthly = climateData?.monthly?.precipitation_sum;

    if (!monthly || monthly.length !== 12) throw new Error("Invalid climate data");

    // Convert mm to inches
    const totalMM = monthly.reduce((a, b) => a + b, 0);
    const totalInches = totalMM * 0.0393701;

    document.getElementById("rainfall").value = totalInches.toFixed(1);
  } catch (err) {
    alert("Could not fetch rainfall data. Try another ZIP.");
    console.error(err);
  }
}

function calculateCatchment() {
  const area = parseFloat(document.getElementById("area").value);
  const rainfall = parseFloat(document.getElementById("rainfall").value);
  if (isNaN(area) || isNaN(rainfall)) {
    document.getElementById("result").textContent = "Please enter valid numbers.";
    return;
  }
  const gallons = area * rainfall * 0.623;
  document.getElementById("result").textContent =
    `You can harvest approximately ${gallons.toFixed(0)} gallons of rainwater per year.`;
}
