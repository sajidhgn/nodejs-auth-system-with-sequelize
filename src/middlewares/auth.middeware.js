const { verify } = require("jsonwebtoken");
const { error } = require("../helpers/responses");
// const { Role } = require("../../models/index");
const db = require("../../models/index"); // Get database
const Role = db.Role;

async function authCheck(req, res, next) {
  try {
    const authRoutes = [
      "/",
      "/auth/register",
      "/auth/verify-code",
      "/auth/login",
      "/auth/reset-password",
      "/auth/forgot-password",
    ];

    if (authRoutes.includes(req.path)) {
      return next();
    }

    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return error(res, "Invalid Token", new Error("Token Not Found"));
    }
    const decoded = verify(token, process.env.APP_KEY);
    const { id: user_id, role_id: role_id } = decoded;

    const role = await Role.findByPk(role_id);
    if (!role) {
      return error(res, "Invalid Role", new Error("Role Not Found"));
    }

    req.user_id = user_id;
    req.role_id = role_id;

    next();
  } catch (err) {
    return error(res, "Invalid Token | Crashed", err);
  }
}

module.exports = authCheck;
