const express = require('express')
const router = express.Router()
const database = require('../database')

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

module.exports = router
