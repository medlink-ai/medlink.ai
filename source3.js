let address = args[0];

async function makeApiRequest(url) {
  try {
    const response = await Functions.makeHttpRequest({
      url,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      params: {
        address: address,
      },
    });

    if (response.error) {
      console.error(`API request error for ${url}:`, response.message);
      return [];
    }

    return response.data || [];
  } catch (error) {
    console.error(`Error making API request for ${url}:`, error);
    return [];
  }
}

try {
  const medicalLicenseAPI = "https://3sxnx9ycb9.execute-api.ap-southeast-1.amazonaws.com/dev/md/license";

  const licenseData = await makeApiRequest(medicalLicenseAPI);

  return Functions.encodeString(JSON.stringify(licenseData));

} catch (error) {
  console.error("Error processing data:", error);
}
