const express = require('express')
const router = express.Router()
const database = require('../database')

router.get('/', (req, res) => {
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

router.get('/users/:id', (req, res) => {
  database.findUserByID(req.params.id)
    .then((user) => {
      res.render('profile', { user: user })
    })
    .catch((error) => {
      res.status(500).render('error', { error })
    })
})

module.exports = router
