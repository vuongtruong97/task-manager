require('dotenv').config()
const mongoose = require('mongoose')
const logger = require('../lib/logger/winston')

const { DB_URI } = process.env

async function connectDB() {
    try {
        await mongoose.connect(DB_URI, {
            family: 4,
            maxPoolSize: 5,
            autoIndex: true,
            socketTimeoutMS: 40000,
            serverSelectionTimeoutMS: 5000,
        })
        logger.info('Connect to db established')
    } catch (e) {
        logger.error(new Error('Connect to db failed'))
        console.log(e)
    }
}

module.exports = connectDB
