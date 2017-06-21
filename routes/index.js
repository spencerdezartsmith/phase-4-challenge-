const express = require('express')
const router = express.Router()
const database = require('../database')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const authHelpers = require('./auth_helpers/helpers')

router.get('/', (req, res) => {
  database.getAlbums()
  .then((albums) => {
    database.getThreeReviews()
      .then((reviews) => {
        res.render('index', { albums: albums, reviews: reviews })
      })
  })
  .catch(error => {
    res.status(500).render('error', { error: error })
  })
})

router.get('/albums/:albumID', authHelpers.loginRequired, (req, res, next) => {
  const albumID = req.params.albumID

   database.getOneAlbumsReviews(albumID)
    .then((reviews) => {
      res.render('album', { albumID: albumID, albumTitle: reviews[0].album_title, reviews: reviews })
    })
    .catch((error) => {
      res.status(500).render('error', { error })
    })
})

router.get('/albums/:id/new-review', authHelpers.loginRequired, (req, res, next) => {
  const albumID = req.params.id

  database.getAlbumByID(albumID)
    .then((album) => {
      res.render('add_review', { album: album })
    })
    .catch((error) => {
      res.status(500).render('error', { error })
    })
})

router.post('/albums/:id/new-review', authHelpers.loginRequired, (req, res, next) => {
  req.checkBody('review', 'Review field cannot be empty').notEmpty()
  let errors = req.validationErrors()

  if (errors) {
    database.getAlbumByID(req.params.id)
      .then(album => res.render('add_review', { errors: errors, album: album }))
      .catch(error => { res.status(500).render('error', { error })})
  } else {
    database.createNewReview(req.body.review, Number(req.user.id), Number(req.params.id))
      .then((id) => {
        res.redirect('/')
      })
      .catch(error => { res.status(500).render('error', { error })})
  }
})

router.delete('/users/reviews/:reviewID', authHelpers.loginRequired, (req, res, next) => {
  database.removeOneReview(req.params.reviewID)
    .then(() => {
      res.status(200)
      res.send('Deleted Review')
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
  database.getUserByID(id)
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

  if (errors) {
    res.render('register', { errors: errors, title: 'Sign up for Vinyl' })
  } else {
    database.createNewUser(req.body)
      .then((user) => {
        res.redirect(`/users/${user.id}`)
      })
      .catch((error) => {
        res.status(500).render('error', { error })
      })
  }
})

router.get('/users/logout', (req, res) => {
  req.logout();
  req.flash('success', 'You have successfully logged out')
  res.redirect('/')
})

router.get('/users/:id', authHelpers.loginRequired, (req, res, next) => {
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
