const express = require('express')
const router = express.Router()
const database = require('../database')

router.get('/', (request, response) => {
  database.getAlbums((error, albums) => {
    if (error) {
      response.status(500).render('error', { error: error })
    } else {
      response.render('index', { albums: albums })
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

module.exports = router
