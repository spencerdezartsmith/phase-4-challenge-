const bcrypt = require('bcryptjs')

const comparePassword = (passwordCred, hash) => {
  return bcrypt.compareSync(passwordCred, hash)
}

module.exports = {
  comparePassword
}
