const data = require('./data.json');
'use strict';

async function maximumPrice(generic_name) {
  try {
    for (var i = 0; i < data[0].drugs.length; i++) {
      if (data[0].drugs[i].generic_name === generic_name) {
        return data[0].drugs[i].maximum_retail_price;
      }
    }
    return "Medicine not available";
  } catch (error) {
    console.log(error);
  }
}

module.exports.mdrp = async (event) => {
  const maximum_retail_price = event.queryStringParameters.generic_name;
  const price = await maximumPrice(maximum_retail_price);
  return {
    statusCode: 200,
    body: JSON.stringify(price),
  };
};
