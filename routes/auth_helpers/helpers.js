const bcrypt = require('bcryptjs')

const comparePassword = (passwordCred, hash) => {
  return bcrypt.compareSync(passwordCred, hash)
}

function loginRequired(req, res, next) {
  if (!req.user) return res.redirect('/users/login');
  return next();
}

module.exports = {
  comparePassword,
  loginRequired
}
