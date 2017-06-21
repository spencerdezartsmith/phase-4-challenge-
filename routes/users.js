const express = require('express')
const router = express.Router()
const database = require('../database')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const authHelpers = require('./auth_helpers/helpers')

router.delete('/reviews/:reviewID', authHelpers.loginRequired, (req, res, next) => {
  database.removeOneReview(req.params.reviewID)
    .then(() => {
      res.status(200)
      res.send('Deleted Review')
    })
})

router.get('/register', (req, res) => {
  res.render('register', { title: 'Sign up for Vinyl' })
})

router.get('/login', (req, res) => {
  res.render('login', { title: 'Sign In' })
})

router.post('/login',
  passport.authenticate('local', { failureRedirect: '/login', failureFlash: 'Invalid Credentials'}),
  (req, res) => {
    req.flash('success', 'You are now logged in!')
    res.status(302).redirect(`/users/${req.user.id}`)
    res.end()
})

passport.serializeUser((user, done) => {
  done(null, user.id)
})

passport.deserializeUser((id, done) => {
  database.getUserByID(id)
    .then((user) => done(null, user))
    .catch((err) => done(err, null))
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

router.post('/register', (req, res, next) => {
  req.checkBody('name', 'Name field is required').notEmpty()
  req.checkBody('email', 'Email field is required').notEmpty()
  req.checkBody('email', 'Email is not valid').isEmail()
  req.checkBody('password', 'Password field is required').notEmpty()
  req.checkBody('password2', 'Passwords do not match').equals(req.body.password)
  let errors = req.validationErrors()

  if (errors) {
    res.render('register', { errors: errors, title: 'Sign up for Vinyl' })
  } else {
    database.createNewUser(req.body)
      .then((user) => {
        req.flash('success', 'You are now registered and can log in!')
        res.redirect(`/users/${user.id}`)
      })
      .catch((error) => {
        res.status(500).render('error', { error })
      })
  }
})

router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success', 'You have successfully logged out')
  res.redirect('/')
})

router.get('/:id', authHelpers.loginRequired, (req, res, next) => {
  const userID = req.params.id
  database.getUserByID(userID)
    .then((user) => {
      const dateJoined = user.date_joined.toString()
      database.getOneUsersReviews(userID)
        .then((reviews) => {
          res.render('profile', { user: user, date: dateJoined, reviews: reviews })
        })
    })
    .catch((error) => {
      res.status(500).render('error', { error })
    })
})

module.exports = router
