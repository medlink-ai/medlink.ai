let drug = args[0];
let result = [];

async function makeApiRequest(url) {
  try {
    const response = await Functions.makeHttpRequest({
      url,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      params: {
        drug_details: drug,
      },
    });

    if (response.error) {
      console.error(`API request error for ${url}:`, response.message);
      return [];
    }

    return response.data.brands || [];
  } catch (error) {
    console.error(`Error making API request for ${url}:`, error);
    return [];
  }
}

try {
  const watsonsUrl = "https://l3h3rjunf1.execute-api.ap-southeast-1.amazonaws.com/dev/v1/ph/watsons/2023";
  const mercuryUrl = "https://l3h3rjunf1.execute-api.ap-southeast-1.amazonaws.com/dev/v1/ph/mercury/2023";

  const watsonsData = await makeApiRequest(watsonsUrl);
  const mercuryData = await makeApiRequest(mercuryUrl);

  result.push(...watsonsData, ...mercuryData);

  if (result.length > 0) {
    let groups = {};
    for (let i = 0; i < result.length; i++) {
      let key = `${result[i].code}`;
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(result[i]);
    }

    let lowestPrices = [];
    let highestPrices = [];
    for (const key in groups) {
      let group = groups[key];
      let lowestPrice = Math.min(...group.map(item => item.discounted_price));
      let highestPrice = Math.max(...group.map(item => item.price));

      lowestPrices.push(lowestPrice);
      highestPrices.push(highestPrice);

      groups[key] = {
        lowestPrice: parseFloat(lowestPrice.toFixed(2)),
        highestPrice: parseFloat(highestPrice.toFixed(2)),
      };
    }

    const y = drug;
    let min = parseFloat(Math.min(...lowestPrices).toFixed(2));
    let max = parseFloat(Math.max(...highestPrices).toFixed(2));
    let med = parseFloat(((min + max) / 2).toFixed(2));

    let finalOutput = { drug: y, min, med, max };

    return Functions.encodeString(JSON.stringify(finalOutput));
  }
} catch (error) {
  console.error("Error processing data:", error);
}
