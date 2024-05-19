const Joi = require('joi');

const userSchema = Joi.object({
    email: Joi.string().email().required()
});

const validateForgotPassword = (req, res, next) => {
    const { error } = userSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ status: "error", message: error.details[0].message });
    }
    next();
};


module.exports = validateForgotPassword;