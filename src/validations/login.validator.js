const Joi = require("joi");

const userSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(), // .min(5).max(30)
});

const validateLogin = (req, res, next) => {
  const { error } = userSchema.validate(req.body);
  if (error) {
    return res
      .status(400)
      .json({ status: "error", message: error.details[0].message });
  }
  next();
};

module.exports = validateLogin;
