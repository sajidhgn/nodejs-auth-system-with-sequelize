const {unauthorized} = require("../helpers/responses");
const {ERRORS} = require("../helpers/messages");

const checkRole = (requiredRoleId) => {
    return (req, res, next) => {
      if (req.role_id === requiredRoleId) {
        return next();
      }
      return unauthorized(res, ERRORS.NOT_AUTHORIZED);
    };
  };
  
  module.exports = checkRole;