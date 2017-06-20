const bcrypt = require('bcryptjs')

const comparePassword = (passwordCred, hash) => {
  return bcrypt.compareSync(passwordCred, hash)
}

const ensureAuthentication = (req, res, next) => {
  if (req.isAuthenticated) {
    return next()
  } else {
    res.redirect('/users/login')
  }
}

module.exports = {
  comparePassword,
  ensureAuthentication
}
