const data = require('./data.json');

'use strict';

async function dpriRange(generic_name) {
  try {
    for (var i = 0; i < data[0].drugs.length; i++) {
      if (data[0].drugs[i].generic_name === generic_name) {
        console.log(data[0].drugs[i].dpri_range);
        return data[0].drugs[i].dpri_range;
      }
    }
    return null;
  } catch (error) {
    console.log(error);
  }
}

module.exports.dpri = async (event) => {
  const generic_name = event.queryStringParameters.generic_name;
  const range = await dpriRange(generic_name);
  return {
    statusCode: 200,
    body: JSON.stringify(range),
  };
};
