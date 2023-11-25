const watsons_data = require('./watsons.json');
const mercury_data = require('./mercury.json');

'use strict';

async function searchProduct(productName, data_source) {
  try {
    const lowerCaseInput = productName.toLowerCase();
    for (const drug of data_source.drugs) {
      if (drug.product_name.toLowerCase() === lowerCaseInput) {
        return drug;
      }
    }
    return;
  } catch (error) {
    console.error(error);
    return;
  }
}

module.exports.watsons = async (event) => {
  const drug_details = event.queryStringParameters.drug_details;
  const details = await searchProduct(drug_details, watsons_data);
  return {
    statusCode: 200,
    body: JSON.stringify(details),
  };
};

module.exports.mercury = async (event) => {
  const drug_details = event.queryStringParameters.drug_details;
  const details = await searchProduct(drug_details, mercury_data);
  return {
    statusCode: 200,
    body: JSON.stringify(details),
  };
};
