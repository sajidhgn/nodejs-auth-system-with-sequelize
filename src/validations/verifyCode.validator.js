const Joi = require('joi');

const userSchema = Joi.object({
    verification_code: Joi.string().required()
});

const validateVerifyCode = (req, res, next) => {
    const { error } = userSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ status: "error", message: error.details[0].message });
    }
    next();
};


module.exports = validateVerifyCode;