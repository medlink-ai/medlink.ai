const KYCAgeCredentialLD = require('./KYCAgeCredentialsLD.json');
const KYCAgeCrendialSchema = require('./KYCAgeCredentialsSchema.json');


'use strict';

module.exports.JSONSchema = async () => {
  return {
    statusCode: 200,
    body: JSON.stringify(KYCAgeCrendialSchema, null, 2),
  };
};


module.exports.JSONLD = async () => {
  return {
    statusCode: 200,
    body: JSON.stringify(KYCAgeCredentialLD, null, 2),
  };
};
