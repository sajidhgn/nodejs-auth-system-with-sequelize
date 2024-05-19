const Joi = require('joi');

const userSchema = Joi.object({
    id: Joi.number().required(),
    password: Joi.string().min(5).max(30).required()
});

const validateResetPassword = (req, res, next) => {
    const { error } = userSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ status: "error", message: error.details[0].message });
    }
    next();
};


module.exports = validateResetPassword;