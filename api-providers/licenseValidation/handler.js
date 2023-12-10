const data = require('./medicalLicense.json');

'use strict';

async function search(walletAddress, data_source) {
  try {
    const lowerCaseInput = walletAddress.toLowerCase();
    for (const record of data_source) {
      if (record.address.toLowerCase() === lowerCaseInput) {
        return record.license_number;
      }
    }
    return;
  } catch (error) {
    console.error(error);
    return;
  }
}

module.exports.licenseValidation = async (event) => {
  const walletAddress = event.queryStringParameters.address;
  const licenseNumber = await search(walletAddress, data);
  return {
    statusCode: 200,
    body: JSON.stringify({license_number: licenseNumber}),
  };
};