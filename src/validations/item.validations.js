const Joi = require('joi');

const createItemSchema = {
    body: Joi.object().required().keys({
        title: Joi.string().required().trim().min(3),
        description: Joi.string().required().trim().min(10),
        startingPrice: Joi.number().required().min(0),
        endTime: Joi.date().required().min('now'), // Must be a future date
        tags: Joi.array().items(Joi.string().trim().min(2)).min(1).max(10) // 1-10 tags required
    }),
    files: Joi.object().required().keys({
        images: Joi.array().items(
            Joi.object().keys({
                mimetype: Joi.string().valid('image/jpeg', 'image/png', 'image/jpg').required(),
                size: Joi.number().max(5 * 1024 * 1024).required() // 5MB limit
            })
        ).length(4).required() // Exactly 4 images required
    })
};

const getActiveItemsSchema = {
    query: Joi.object().keys({
        search: Joi.string().trim().min(1),
        minPrice: Joi.number().min(0),
        maxPrice: Joi.number().min(0).when('minPrice', {
            is: Joi.exist(),
            then: Joi.number().min(Joi.ref('minPrice'))
        }),
        tags: Joi.alternatives().try(
            Joi.string().trim(),
            Joi.array().items(Joi.string().trim())
        ),
        currentBid: Joi.object().keys({
            min: Joi.number().min(0),
            max: Joi.number().min(0).when('min', {
                is: Joi.exist(),
                then: Joi.number().min(Joi.ref('min'))
            })
        }),
        sortBy: Joi.string().valid('currentPrice', 'endTime', 'createdAt'),
        sortOrder: Joi.string().valid('asc', 'desc').default('asc')
    })
};

module.exports = {
    createItemSchema,
    getActiveItemsSchema
}; 