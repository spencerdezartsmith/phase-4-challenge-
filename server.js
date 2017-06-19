const express = require('express')
const bodyParser = require('body-parser')
// const database = require('./database')
const app = express()
const path = require('path')
const session = require('express-session')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const flash = require('connect-flash')

const routes = require('./routes/index')

require('ejs')
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs');

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: false }))

app.use('/', routes)

app.use((request, response) => {
  response.status(404).render('not_found')
})

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}...`)
})
