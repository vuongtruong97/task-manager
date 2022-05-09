require('dotenv').config()
const express = require('express')
const connectDB = require('./db/db')
const configRouter = require('./routes/routes')
const { PORT = 3000 } = process.env

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

connectDB()
configRouter(app)

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})
