const data = require("./data.json");

function autocomplete(input) {
  const lowerCaseInput = input.toLowerCase();
  return data.data.filter(str => str.toLowerCase().startsWith(lowerCaseInput));
}

module.exports.medList = async (event) => {
  const userInput = event.queryStringParameters.input;
  const results = autocomplete(userInput);

  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST,PATCH,OPTIONS'
  };

  const response = {
    statusCode: 200,
    headers: headers,
    body: JSON.stringify(results), // X is the response that you want to return
  };

  return response;
};
