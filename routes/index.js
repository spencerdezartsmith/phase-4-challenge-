const express = require('express')
const router = express.Router()
const database = require('../database')

router.get('/', (request, response) => {
  database.getAlbums((error, albums) => {
    if (error) {
      response.status(500).render('error', { error: error })
    } else {
      response.render('index', { albums: albums, title: 'Home' })
    }
  })
})

router.get('/albums/:albumID', (request, response) => {
  const albumID = request.params.albumID

  database.getAlbumsByID(albumID, (error, albums) => {
    if (error) {
      response.status(500).render('error', { error: error })
    } else {
      const album = albums[0]
      response.render('album', { album: album })
    }
  })
})

router.get('/users/register', (request, response) => {
  response.render('register', { title: 'Sign up for Vinyl' })
})

router.get('/users/login', (request, response) => {
  response.render('login', { title: 'Sign In' })
})

router.post('/users/register', (request, response) => {

  request.checkBody('name', 'Name field is required').notEmpty()
  request.checkBody('email', 'Email field is required').notEmpty()
  request.checkBody('email', 'Email is not valid').isEmail()
  request.checkBody('password', 'Password field is required').notEmpty()
  request.checkBody('password2', 'Passwords do not match').equals(request.body.password)
  const errors = request.validationErrors()

  if (errors) {
    response.render('register', { errors: errors, title: 'Sign up for Vinyl' })
  } else {
    console.log('no errors')
  }
})

module.exports = router
