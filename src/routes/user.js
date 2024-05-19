const express = require("express");
const router = express.Router();
const checkRole = require("../middlewares/role.middleware.js");
const { error, success } = require("../helpers/responses.js");
const { SUCCESS, ERRORS } = require("../helpers/messages.js");
const UserRepository = require("../services/userRepository.js");

router.use(checkRole(1));

router.post("/user", async (req, res) => {
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
      const updatedUser =await user.update(userObject);
      return success(res, updatedUser, SUCCESS.UPDATED_SUCCESSFULLY);
    } else {
      const data = await UserRepository.createUser(userObject);
      return success(res, data, SUCCESS.CREATED_SUCCESSFULLY);
    }
  } catch (_error) {
    return error(res, ERRORS.SOMETHING_WENT_WRONG, _error);
  }
});

router.get("/users", async (req, res) => {
  try {
    const users = await UserRepository.getUsers();
    return success(res, users, SUCCESS.LISTING_FOUND);
  } catch (_error) {
    return error(res, ERRORS.SOMETHING_WENT_WRONG, _error);
  }
});

router.get("/user/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await UserRepository.getUserById(id);
    return success(res, user, SUCCESS.GET_SINGLE_SUCCESSFULLY);
  } catch (_error) {
    return error(res, ERRORS.SOMETHING_WENT_WRONG, _error);
  }
});

router.put("/user/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await UserRepository.updateUser(id, req.body);
    return success(res, user, SUCCESS.UPDATED_SUCCESSFULLY);
  } catch (_error) {
    return error(res, ERRORS.SOMETHING_WENT_WRONG, _error);
  }
});

router.delete("/user/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await UserRepository.deleteUser(id);
    return success(res, user, SUCCESS.DELETED_SUCCESSFULLY);
  } catch (_error) {
    return error(res, ERRORS.SOMETHING_WENT_WRONG, _error);
  }
});

module.exports = router;
