import Joi from 'joi';


const createAndFundSub = Joi.object({
    consumerAddress: Joi.string().required(),
    linkAmount: Joi.string().required()
})

const postFunctionsRequest = Joi.object({
    consumerAddress: Joi.string().required(),
    subscriptionId: Joi.string().required(),
    drug_details: Joi.string().required(),
})

const functionRequestProvider = Joi.object({
    drug: Joi.string().required(),
    amount: Joi.string().required()
})

export default { createAndFundSub, postFunctionsRequest, functionRequestProvider };