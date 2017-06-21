const express = require('express')
const router = express.Router()
const database = require('../database/queries')
const authHelpers = require('./auth_helpers/helpers')

router.get('/:albumID', authHelpers.loginRequired, (req, res, next) => {
  const albumID = req.params.albumID

   database.getAlbumByID(albumID)
    .then((album) => {
      database.getOneAlbumsReviews(albumID)
       .then((reviews) => {
         res.render('album', { albumID: albumID, albumTitle: album.title, reviews: reviews })
       })
       .catch((error) => {
         res.status(500).render('error', { error })
       })
    })
})

router.get('/:id/new-review', authHelpers.loginRequired, (req, res, next) => {
  const albumID = req.params.id

  database.getAlbumByID(albumID)
    .then((album) => {
      res.render('add_review', { album: album })
    })
    .catch((error) => {
      res.status(500).render('error', { error })
    })
})

router.post('/:id/new-review', authHelpers.loginRequired, (req, res, next) => {
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

module.exports = router
