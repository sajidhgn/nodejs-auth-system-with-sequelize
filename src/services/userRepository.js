const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const { Op } = require("sequelize");
const db = require("../../models/index"); // Get database
const User = db.User; // Get modal from databse


async function createUser(userData) {
  return await User.create(userData);
}

async function getUserById(id) {
  return await User.findByPk(id);
}

async function getUserByEmail(identifier) {
  try {
    const user = await User.findOne({
      where: {
        email: identifier,
      },
    });
    if (user) {
      console.log("User data is:", user.toJSON()); // Log user data if it exists
    } else {
      console.log("User not found"); // Log a message if user is not found
    }
    return user;
  } catch (error) {
    console.error("Error fetching user:", error); // Log any errors that occur during the query
    throw error; // Throw the error to be handled by the caller
  }
}

async function getUserByEmailOrCode(identifier) {
  const verificationCode = await User.findOne({
    where: {
      [Op.or]: [{ email: identifier }, { verification_code: identifier }],
    },
  });
  return verificationCode;
}

async function getUsers() {
  return await User.findAll({});
}

async function updateUser(id, userData) {
  const user = await getUserById(id);
  if (!user) {
    throw new Error("User not found");
  }

  if (userData.password) {
    userData.password = await hashedPassword(userData.password);
  }

  await user.update(userData);
  return user;
}

async function deleteUser(id) {
  const user = await getUserById(id);
  if (!user) {
    throw new Error("User not found");
  }
  return await user.destroy();
}

async function hashedPassword(password) {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  return hash;
}

async function comparePassword(userData) {
  const user = await getUserByEmail(userData?.email);
  const result = await bcrypt.compare(userData?.password, user?.password);
  return result;
}

async function generateToken(data) {
  const token = jwt.sign(
    { id: data?.id, role_id: data?.role_id },
    process.env.APP_KEY
  );
  return token;
}

async function generateRandomPassword(length) {
  let password = "";
  const possibleChars = "0123456789";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * possibleChars.length);
    password += possibleChars.charAt(randomIndex);
  }

  return password;
}

async function compareOldPassword(userData) {
  const user = await getUserById(userData?.id);
  const result = await bcrypt.compare(userData?.password, user?.password);
  return result;
}

async function sendVerificationCode(email, verification_code) {
  const code_expired_at = new Date();
  code_expired_at.setMinutes(code_expired_at.getMinutes() + 30);

  const data = {
    verification_code: verification_code,
    code_expired_at: code_expired_at,
  };

  const user = await getUserByEmail(email);
  if (!user) {
    throw new Error("User not found");
  }

 return await user.update(data);
 
}

async function findAndDelete(email) {
  try {
    const matchEmail = await getUserByEmailOrCode(email);
    if (matchEmail) {
      await matchEmail.update({ verification_code: null });
    }
    return true;
  } catch (error) {
    return false;
  }
}

module.exports = {
  createUser,
  getUserById,
  getUserByEmail,
  getUsers,
  updateUser,
  deleteUser,
  hashedPassword,
  comparePassword,
  generateToken,
  generateRandomPassword,
  compareOldPassword,
  sendVerificationCode,
  getUserByEmailOrCode,
  findAndDelete,
};
