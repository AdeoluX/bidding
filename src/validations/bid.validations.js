const Joi = require('joi');

const createBidSchema = {
    params: Joi.object().required().keys({
        itemId: Joi.string().required()
    }),
    body: Joi.object().required().keys({
        amount: Joi.number().required().min(0)
    })
};

module.exports = {
    createBidSchema
}; 