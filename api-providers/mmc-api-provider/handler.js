const data = require('./data.json');
'use strict';

async function retailPrice(drug_name) {
  try {
    let result = [];
    for (var i = 0; i < data[0].drugs.length; i++) {
      if (data[0].drugs[i].generic_name === drug_name || data[0].drugs[i].brand_name === drug_name) {
        result.push({
          generic_name: data[0].drugs[i].generic_name,
          brand_name: data[0].drugs[i].brand_name,
          concentration: data[0].drugs[i].concentration,
          form: data[0].drugs[i].form,
          maximum_retail_price: data[0].drugs[i].maximum_retail_price,
          prescription: data[0].drugs[i].prescription
        });
      }
      
    }
    return result.length > 0 ? result : "Medicine not available";
  } catch (error) {
    console.log(error);
  }
}

module.exports.mmc = async (event) => {
  const drug_name = event.queryStringParameters.drug_name;
  const details = await retailPrice(drug_name);
  return {
    statusCode: 200,
    body: JSON.stringify(details),
  };
};