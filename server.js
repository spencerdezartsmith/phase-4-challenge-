const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const path = require('path')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const flash = require('connect-flash')
const bcrypt = require('bcryptjs')
const expressValidator = require('express-validator')
const config = require('./config/config')

const routes = require('./routes/index')
const users = require('./routes/users')
const albums = require('./routes/albums')

require('pug')
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug');

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())

// Handle Sessions
app.use(session({
  secret: config.SECRET,
  saveUninitialized: true,
  resave: true
}))

// Passport
app.use(passport.initialize())
app.use(passport.session())

// Validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

app.get('*', (req, res, next) => {
  res.locals.user = req.user || null
  next()
})

app.use('/', routes)
app.use('/users', users)
app.use('/albums', albums)

app.use((request, response) => {
  response.status(404).render('not_found')
})

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}...`)
})
