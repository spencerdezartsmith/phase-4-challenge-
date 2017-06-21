// const pg = require('pg')
const bcrypt = require('bcryptjs')
const promise = require('bluebird')
const options = {
  promiseLib: promise
}

const pgp = require('pg-promise')(options)

const dbName = 'vinyl'
const connectionString = process.env.DATABASE_URL || `postgres://localhost:5432/${dbName}`
const db = pgp(connectionString)

const getAlbums = () => { return db.any('SELECT * FROM albums') }

const getAlbumByID = (albumID) => {
  return db.one('SELECT * FROM albums WHERE id = $1', [albumID])
}

const createNewUser = (data) => {
  const sql = 'INSERT INTO users(name, email, password) values($1, $2, $3) RETURNING id'
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(data.password, salt);
  const variables = [
    data.name,
    data.email,
    hash
  ]
  return db.one(sql, variables)
}

const getUserByID = (userID) => {
  return db.one('SELECT * FROM users WHERE id = $1', [userID])
}

const getUserByEmail = (email) => {
  return db.one('SELECT * FROM users WHERE email = $1', [email])
}

const getThreeReviews = () => {
  return db.any('SELECT reviews.review, reviews.review_date, albums.title AS album_title, users.name AS reviewer, albums.id AS album_id FROM (reviews INNER JOIN albums ON reviews.album_id = albums.id) INNER JOIN users ON reviews.user_id = users.id ORDER BY reviews.review_date DESC LIMIT 3')
}

const getOneAlbumsReviews = (albumID) => {
  return db.any('SELECT reviews.review, reviews.review_date, albums.title AS album_title, users.name AS reviewer FROM (reviews INNER JOIN albums ON reviews.album_id = albums.id) INNER JOIN users ON reviews.user_id = users.id WHERE albums.id = $1 ORDER BY reviews.review_date DESC;', [albumID])
}

const createNewReview = (review, userID, albumID) => {
  return db.one('INSERT INTO reviews(review, user_id, album_id) VALUES ($1, $2, $3) RETURNING id', [review, userID, albumID])
}

const getOneUsersReviews = (userID) => {
  return db.any('SELECT reviews.id, reviews.review, reviews.review_date, albums.id AS album_id, albums.title AS album_title, users.name AS reviewer FROM (reviews INNER JOIN albums ON reviews.album_id = albums.id) INNER JOIN users ON reviews.user_id = users.id WHERE users.id = $1 ORDER BY reviews.review_date DESC;', [userID])
}

const removeOneReview = (reviewID) => {
  return db.none('DELETE FROM reviews WHERE id = $1', [reviewID])
}



module.exports = {
  getAlbums,
  getAlbumByID,
  createNewUser,
  getUserByID,
  getUserByEmail,
  getThreeReviews,
  getOneAlbumsReviews,
  createNewReview,
  getOneUsersReviews,
  removeOneReview
}
