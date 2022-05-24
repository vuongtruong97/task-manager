require('dotenv').config()
const express = require('express')
const cookieParser = require('cookie-parser')
const handlebars = require('express-handlebars')
const cors = require('cors')
const path = require('path')
const connectDB = require('./db/db')
const configRouter = require('./routes/routes')

const app = express()
const pathViews = path.join(__dirname, 'views')
const { PORT = 1997 } = process.env

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser('secret'))
app.use(cors())

// config views engine
app.engine('hbs', handlebars.engine({ extname: 'hbs' }))
app.set('view engine', 'hbs')
app.set('views', pathViews)

connectDB()
configRouter(app)

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})
