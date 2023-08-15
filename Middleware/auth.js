const jwt = require("jsonwebtoken");
const { Unauthorized } = require("../errors");
const auth = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Unauthorized("Authentication Invalid");
  }
  const token = authHeader.split(" ")[1];
  try {
    const payload = jwt.verify(token, process.env.SECRET_KEY);
    req.user = { userId: payload.userId, name: payload.name };
    next();
  } catch (error) {
    console.log(error);
    throw new Unauthorized("Authentication Invalid");
  }
};
module.exports = auth;
