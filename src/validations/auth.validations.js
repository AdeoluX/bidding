const Joi = require('joi');

const signInSchema = {
    body: Joi.object().required().keys({
        email: Joi.string().email().required(),
        password: Joi.string().required(),
    }),
}

const signUpSchema = {
    body: Joi.object().required().keys({
        email: Joi.string().email().required(),
        password: Joi.string().required(),
        confirm_password: Joi.string().required(),
        firstname: Joi.string().required(),
        lastname: Joi.string().required(),
        phone: Joi.string(),
        address: Joi.string(),
        tin: Joi.string(),
    }),
}

const verifyTinSchema = {
    params: Joi.object().required().keys({
        userId: Joi.string().required(),
    }),
    body: Joi.object().required().keys({
        status: Joi.string().valid('verified', 'rejected').required(),
        note: Joi.string().allow(null, ''),
    }),
}

const checkEligibilitySchema = {
    params: Joi.object().required().keys({
        userId: Joi.string().required(),
    }),
}

const resetPasswordSchema = {
    body: Joi.object().required().keys({
        email: Joi.string().email().required(),
    }),
}

const confirmResetPasswordSchema = {
    body: Joi.object().required().keys({
        token: Joi.string().required(),
        newPassword: Joi.string().required(),
        confirmPassword: Joi.string().required().valid(Joi.ref('newPassword')),
    }),
}

module.exports = {
    signInSchema,
    signUpSchema,
    verifyTinSchema,
    checkEligibilitySchema,
    resetPasswordSchema,
    confirmResetPasswordSchema
}