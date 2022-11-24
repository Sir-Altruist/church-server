const { register, login, admin } = require('./authentication');

const ports = {
  register,
  login,
  admin,
};

module.exports = ports;
