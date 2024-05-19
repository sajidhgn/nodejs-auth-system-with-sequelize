const validateRegister = require("./register.validator");
const validateLogin = require("./login.validator");
const validateForgotPassword = require("./forgot.validator");
const validateVerifyCode = require("./verifyCode.validator");
const validateResetPassword = require("./resetPassword.validator");
const validateLogout = require("./logout.validator");

module.exports = {
    validateRegister,
    validateLogin,
    validateForgotPassword,
    validateVerifyCode,
    validateResetPassword,
    validateLogout
}