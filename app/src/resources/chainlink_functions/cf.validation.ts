import Joi from 'joi';

const functionsConsumer = Joi.object({
    NETWORK: Joi.string().valid('ethereumSepolia', 'polygonMumbai').required()
})

const deployConsumerContract = Joi.object({
    NETWORK: Joi.string().valid('ethereumSepolia', 'polygonMumbai').required(),
});

const createAndFundSub = Joi.object({
    NETWORK: Joi.string().valid('ethereumSepolia', 'polygonMumbai').required(),
    consumerAddress: Joi.string().required(),
    linkAmount: Joi.string().required()
})

const request = Joi.object({
    consumerAddress: Joi.string().required(),
    subscriptionId: Joi.string().required(),
    drug_details: Joi.string().required(),
})

const response = Joi.object({
    consumerAddress: Joi.string().required(),
})

export default { functionsConsumer, deployConsumerContract, createAndFundSub, request, response };