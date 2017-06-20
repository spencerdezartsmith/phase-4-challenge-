const express = require('express')
const router = express.Router()
const database = require('../database')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const authHelpers = require('./auth_helpers/helpers')

router.get('/', (req, res) => {
  res.render('landing-page')
})

router.get('/albums', authHelpers.ensureAuthentication, (req, res) => {
  database.getAlbums()
  .then((albums) => {
    res.render('index', { albums: albums })
  })
  .catch(error => {
    res.status(500).render('error', { error: error })
  })
})

router.get('/albums/:albumID', (req, res) => {
  const albumID = req.params.albumID

  database.getAlbumsByID(albumID)
    .then((album) => {
      res.render('album', { album: album })
    })
    .catch((error) => {
      res.status(500).render('error', { error })
    })
})

router.get('/users/register', (req, res) => {
  res.render('register', { title: 'Sign up for Vinyl' })
})

router.get('/users/login', (req, res) => {
  res.render('login', { title: 'Sign In' })
})

router.post('/users/login',
  passport.authenticate('local', { failureRedirect: '/users/login', failureFlash: 'Invalid Credentials'}),
  (req, res) => {
    req.flash('success', 'You are now logged in!')
    res.status(302).redirect(`/users/${req.user.id}`)
})

passport.serializeUser((user, done) => {
  done(null, user.id)
})

passport.deserializeUser((id, done) => {
  database.findUserByID(id)
    .then((user) => done(null, user))
    .catch((error) => done(err, null))
})

const options = { usernameField: 'email' }
passport.use(new LocalStrategy(options, (username, password, done) => {
  database.getUserByEmail(username)
    .then((user) => {
      if (!user) return done(null, false)
      if (!authHelpers.comparePassword(password, user.password)) {
        return done(null, false)
      } else {
        return done(null, user)
      }
    })
    .catch((err) => { return done(err) })
}))

router.post('/users/register', (req, res, next) => {
  req.checkBody('name', 'Name field is required').notEmpty()
  req.checkBody('email', 'Email field is required').notEmpty()
  req.checkBody('email', 'Email is not valid').isEmail()
  req.checkBody('password', 'Password field is required').notEmpty()
  req.checkBody('password2', 'Passwords do not match').equals(req.body.password)
  let errors = req.validationErrors()
  let url;

  if (errors) {
    res.render('register', { errors: errors, title: 'Sign up for Vinyl' })
  } else {
    database.createNewUser(req.body)
      .then((user) => {
        url = `/users/${user.id}`
        res.redirect(url)
      })
      .catch((error) => {
        res.status(500).render('error', { error })
      })
  }
})

router.get('/users/logout', (req, res) => {
  req.logout();
  req.flash('success', 'You have successfully logged out')
  res.redirect('/users/login')
})

router.get('/users/:id', (req, res) => {
  database.findUserByID(req.params.id)
    .then((user) => {
      const dateJoined = user.datejoined.toString()
      res.render('profile', { user: user, date: dateJoined })
    })
    .catch((error) => {
      res.status(500).render('error', { error })
    })
})


module.exports = router
