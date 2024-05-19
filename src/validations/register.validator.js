const Joi = require('joi');

const userSchema = Joi.object({
    first_name: Joi.string().required(),
    last_name: Joi.string(),
    password: Joi.string().min(5).max(30).required(),
    gender: Joi.string(),
    email: Joi.string().email().required(),
    // role_id: Joi.string().valid(1, 2).default(1),
});

const validateRegister = (req, res, next) => {
    const { error } = userSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ status: "error", message: error.details[0].message });
    }
    next();
};


module.exports = validateRegister;