require('dotenv').config()
const mongoose = require('mongoose')
const logger = require('../lib/logger/winston')
const { DB_URI_PROD, DB_URI_DEV, DB_URI_TEST, NODE_ENV } = process.env

let dataBaseUri = DB_URI_PROD
if (NODE_ENV === 'dev') {
    dataBaseUri = DB_URI_DEV
}
if (NODE_ENV === 'test') {
    dataBaseUri = DB_URI_TEST
}

async function connectDB() {
    try {
        await mongoose.connect(dataBaseUri, {
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
