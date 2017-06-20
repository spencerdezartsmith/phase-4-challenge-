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

const getAlbumsByID = (albumID) => {
  return db.one('SELECT * FROM albums WHERE id = $1', [albumID])
}

const createNewUser = (data) => {
  const sql = 'INSERT INTO users(name, email, password) values($1, $2, $3) RETURNING id'
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync("B4c0/\/", salt);
  const variables = [
    data.name,
    data.email,
    hash
  ]

  return db.one(sql, variables)
}

const findUserByID = (userID) => {
  return db.one('SELECT * FROM users WHERE id = $1', [userID])
}

module.exports = {
  getAlbums,
  getAlbumsByID,
  createNewUser,
  findUserByID
}
