require('dotenv').config()
const express = require('express')

const app = express()
const { PORT = 3000 } = process.env

app.get('', (req, res) => {
    res.send('<h1>Hello Express,Hello Heroku</h1>')
})

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})
