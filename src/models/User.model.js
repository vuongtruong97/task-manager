const mongoose = require('mongoose')
const validator = require('validator')

const { Schema } = mongoose

const userSchema = new Schema(
    {
        firstName: { type: String, trim: true },
        lastName: { type: String, trim: true },
        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            validate(value) {
                if (!validator.isEmail(value)) {
                    throw new Error('Please insert a valid email address')
                }
            },
        },
        age: {
            type: Number,
            default: 0,
            validate(value) {
                if (value < 0) {
                    throw new Error('Age must be positive number')
                }
            },
        },
        gender: { type: String },
        address: { type: String },
        password: {
            type: String,
            required: [true, 'Please insert password'],
            trim: true,
        },
        role: { type: String, default: 'USER' },
    },
    { timestamps: true }
)

const User = mongoose.model('User', userSchema)

module.exports = User
