let code = args[0];
let budget = args[1];
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
        drug_details: code,
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

  const acceptedAmount = parseFloat(budget);

  
  if (result.length > 0) {
    let offer = [];

    for (let i = 0; i < result.length; i++) {
      if (result[i].price <= acceptedAmount || result[i].discounted_price <= acceptedAmount) {
        offer.push({"p": result[i].provider_code , "b": result[i].code});
      }
    }

    return Functions.encodeString(JSON.stringify(offer));
  }
} catch (error) {
  console.error("Error processing data:", error);
}
