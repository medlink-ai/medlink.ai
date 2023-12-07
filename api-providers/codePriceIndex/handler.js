const codesToGenerics = require('./codesToGenerics.json');

'use strict';

async function searchProduct(productName, data_source) {
  try {
    const lowerCaseInput = productName.toLowerCase();
    for (const data of data_source) {
      if (data.product_name.toLowerCase() === lowerCaseInput) {
        return data;
      }
    }
    return null; // Returning null instead of undefined for clarity
  } catch (error) {
    console.error(error);
    throw error; // Rethrow the error for proper error handling
  }
}

module.exports.codes = async (event) => {
  try {
    const drugDetails = event.queryStringParameters.product_name;
    const details = await searchProduct(drugDetails, codesToGenerics);

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
