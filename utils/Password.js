const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const getToken = (userId, name) => {
  return jwt.sign({ userId, name }, process.env.SECRET_KEY, {
    expiresIn: process.env.EXPIRY_TIME,
  });
};
const validatePassword = async (thisPassword, enteredPassword) => {
  return await bcrypt.compare(enteredPassword, thisPassword);
};
module.exports = { getToken, validatePassword };
