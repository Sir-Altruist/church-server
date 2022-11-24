const jwt = require('jsonwebtoken');
require('dotenv').config();

function auth(req, res, next) {
  const token = req.header('Authorization');

  //Check for token header
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }
  try {
    //verfiy token
    const decode = jwt.verify(token, process.env.SECRET_KEY);
    // Add user from payload
    req.user = decode;
    next();
  } catch (error) {
    return res
      .status(500)
      .json({ msg: 'Token is not valid! Please login again' });
  }
}

module.exports = auth;
