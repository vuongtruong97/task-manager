const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { SECRET_KEY, EXPERT_KEY } = process.env

const { Schema } = mongoose

const userSchema = new Schema(
    {
        firstName: { type: String, trim: true },
        lastName: { type: String, trim: true },
        email: {
            type: String,
            unique: true,
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
            validate(value) {
                if (
                    !validator.isStrongPassword(value, {
                        minLength: 8,
                        minLowercase: 1,
                        minUppercase: 1,
                        minNumbers: 1,
                        minSymbols: 1,
                    })
                ) {
                    throw new Error(
                        'Password must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters'
                    )
                }
            },
        },
        tokens: [{ token: { type: String, require: true } }],
        role: { type: String, default: 'USER' },
    },
    { timestamps: true }
)

//mongoose instance method example (must use with instance not Model)
userSchema.methods.findSimilarName = function (callback) {
    return mongoose.model('User').find({ firstName: this.firstName }, callback)
}

userSchema.methods.generateAuthToken = async function () {
    const user = this
    const tokenData = { id: this.id }

    const token = await jwt.sign(tokenData, SECRET_KEY, {
        expiresIn: EXPERT_KEY,
    })
    user.tokens = user.tokens.concat({ token })
    await user.save()

    return token
}

//mongoose statics method
userSchema.statics.findByCredentials = async function (email, password) {
    const user = await User.findOne({ email })
    if (!user) {
        throw new Error('Email not match')
    }

    const isMatch = await bcrypt.compare(password, user.password)
    console.log(isMatch)

    if (!isMatch) {
        throw new Error('Password not match')
    }
    return user
}

//mongoose middleware test
userSchema.pre('init', async function () {
    console.log('-----------mongoose middleware-------------')
    console.log('init pre')
})
userSchema.post('init', async function () {
    console.log('init post')
})

userSchema.pre('validate', async function () {
    console.log('validate pre')
})
userSchema.post('validate', async function () {
    console.log('validate post')
})

userSchema.pre('remove', async function () {
    console.log('remove pre')
})
userSchema.post('remove', async function () {
    console.log('remove post')
})

userSchema.pre('updateOne', async function () {
    console.log('updateOne pre')
})
userSchema.post('updateOne', async function () {
    console.log('updateOne post')
})

userSchema.pre('deleteOne', async function () {
    console.log('deleteOne pre')
})
userSchema.post('deleteOne', async function () {
    console.log('deleteOne post')
})

userSchema.post('save', async function () {
    console.log('save post')
    console.log('----------end------------')
})
// hash the plain text password before saving
userSchema.pre('save', async function () {
    const user = this
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 10)
    }
    console.log('save pre')
})

const User = mongoose.model('User', userSchema)

module.exports = User
