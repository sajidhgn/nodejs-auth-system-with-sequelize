const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
// const { User } = require("../../models/index");
const db = require("../../models/index"); // Get database
const User = db.User;
const { error, success } = require("../helpers/responses.js");
const {
  validateRegister,
  validateLogin,
  validateForgotPassword,
  validateVerifyCode,
  validateResetPassword,
  validateLogout,
} = require("../validations/index");
const { ERRORS, SUCCESS } = require("../helpers/messages.js");
const UserRepository = require("../services/userRepository.js");

router.post("/register", validateRegister, async (req, res) => {
  try {
    const { first_name, last_name, gender, email, password } = req.body;
    const hashedPwd = await UserRepository.hashedPassword(password);
    const userObject = {
      first_name: first_name,
      last_name: last_name,
      gender: gender,
      email: email,
      password: hashedPwd,
      role_id: 2,
    };
    const user = await UserRepository.getUserByEmailOrCode(email);
    if (user) {
      const updatedUser = await user.update(userObject);
      return success(res, updatedUser, SUCCESS.UPDATED_SUCCESSFULLY);
    } else {
      const data = await UserRepository.createUser(userObject);
      return success(res, data, SUCCESS.CREATED_SUCCESSFULLY);
    }
  } catch (_error) {
    return error(res, ERRORS.SOMETHING_WENT_WRONG, _error);
  }
});

router.post("/login", validateLogin, async (req, res) => {
  try {
    const { email } = req.body;

    const user = await UserRepository.getUserByEmail(email);

    if (!user) {
      return error(res, ERRORS.USER_NOT_FOUND);
    }
    const isMatch = await UserRepository.comparePassword(req.body);

    if (!isMatch) {
      return error(res, ERRORS.INVALID_CREDENTIALS);
    }
    const token = await UserRepository.generateToken(user);
    return success(
      res,
      { token: token, role: user.role_id },
      SUCCESS.LOGGED_IN_SUCCESSFULLY
    );
  } catch (_error) {
    return error(res, ERRORS.SOMETHING_WENT_WRONG, _error);
  }
});

router.post("/forgot-password", validateForgotPassword, async (req, res) => {
  try {
    const { email } = req.body;
    const user = await UserRepository.getUserByEmailOrCode(email);
    if (!user) {
      return error(res, ERRORS.USER_NOT_FOUND);
    }

    await UserRepository.findAndDelete(email);
    const verification_code = await UserRepository.generateRandomPassword(6);
    await UserRepository.sendVerificationCode(email, verification_code);

    const transporter = createTransporter();
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Reset Password",
      text: `Email: ${email} .\nVerification Code: ${verification_code}`,
    };
    // Send email
    transporter.sendMail(mailOptions, (error) => {
      if (error) {
        console.error("Error sending verification code email:", error);
        return error(res, error.toString());
      } else {
        return success(
          res,
          { verification_code },
          SUCCESS.FORGOT_PASSWORD_EMAIL
        );
      }
    });
  } catch (_error) {
    return error(res, ERRORS.SOMETHING_WENT_WRONG, _error);
  }
});

router.post("/verify-code", validateVerifyCode, async (req, res) => {
  try {
    const { verification_code } = req.body;

    const verificationCode = await UserRepository.getUserByEmailOrCode(
      verification_code
    );

    if (!verificationCode) {
      return error(res, ERRORS.INVALID_VERIFICATION_CODE);
    }
    const now = new Date();
    if (now > verificationCode.code_expired_at) {
      return error(res, ERRORS.EXPIRED_CODE);
    }
    await verificationCode.update({ where: { verification_code } });
    return success(res, { verificationCode }, SUCCESS.VERIFY_CODE_VALID);
  } catch (_error) {
    return error(res, ERRORS.SOMETHING_WENT_WRONG, _error);
  }
});

router.post("/reset-password", validateResetPassword, async (req, res) => {
  try {
    const { password, id } = req.body;
    const isMatch = await UserRepository.compareOldPassword(req.body);
    if (isMatch) {
      return error(res, ERRORS.OLD_PASSWORD_NOT_ALLOWED);
    }
    const hashPwd = await UserRepository.hashedPassword(password);
    const data = {
      id: id,
      password: hashPwd,
    };
    const resp = await UserRepository.updateUser(id, data);
    return success(res, resp, SUCCESS.PASSWORD_UPDATED_SUCCESSFULLY);
  } catch (_error) {
    return error(res, ERRORS.SOMETHING_WENT_WRONG, _error);
  }
});

router.post("/logout", validateLogout, async (req, res) => {
  try {
    req.session.destroy((err) => {
      if (err) {
        return error(res, {}, "An error occurred during logout.");
      } else {
        return success(
          res,
          { redirect: "/login" },
          SUCCESS.LOGGED_OUT_SUCCESSFULLY
        );
      }
    });
  } catch (_error) {
    return error(res, ERRORS.SOMETHING_WENT_WRONG, _error);
  }
});

function createTransporter() {
  return nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
}

module.exports = router;
