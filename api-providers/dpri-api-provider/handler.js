const data = require('./data.json');

'use strict';

module.exports.dpri = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        dpri: data,
      },
      null,
      2
    ),
  };

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
