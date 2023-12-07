const codesToVerifiers = require('./codesVerifiers.json');

"use strict"

async function searchProduct(providerCode, productCode, data_source) {
  try {
    const intProviderCode = parseInt(providerCode);
    const stringProductCode = productCode.toString();

    const result = data_source.find(data => {
      return data.code === stringProductCode && data.provider_code === intProviderCode;
    });

    return result || null;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

module.exports.productCodes = async (event) => {
  try {
    const providerCode = event.queryStringParameters.provider_code;
    const productCode = event.queryStringParameters.product_code;

    const details = await searchProduct(providerCode, productCode, codesToVerifiers);
    if (details) {
      return {
        statusCode: 200,
        body: JSON.stringify(details),
      };
    } else {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Product not found' }),
      };
    }
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};
