const data = require("./data.json")
'use strict';

module.exports.medList = async () => {
  return {
    statusCode: 200,
    body: JSON.stringify(data),
  };
};
