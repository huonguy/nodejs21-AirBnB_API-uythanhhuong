const jwt = require("jsonwebtoken");

const generateToken = (payload) => {
  const token = jwt.sign({ data: payload }, process.env.SECRECT_KEY, {
    expiresIn: process.env.JWT_EXPIRED_TIME,
  });

  return token;
};

const decodeToken = (token) => {
  const decode = jwt.verify(token, process.env.SECRECT_KEY);

  return decode;
};

module.exports = {
  generateToken,
  decodeToken,
};
