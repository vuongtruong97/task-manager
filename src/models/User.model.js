const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { SECRET_KEY, EXPERT_KEY } = process.env
const Task = require('./Task.model')

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
        avatar: {
            contentType: { type: String },
            data: { type: Buffer },
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
                    throw new Error('Password must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters')
                }
            },
        },
        tokens: [{ token: { type: String, require: true } }],
        role: { type: String, default: 'USER' },
    },
    { timestamps: true, toJSON: { virtuals: true } }
)

// virual fiels

userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner',
})

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

//custom toJSON method to hide secret data
userSchema.methods.toJSON = function () {
    const user = this
    //convert mongoose document to js object
    const publicProfile = user.toObject()

    delete publicProfile.password
    delete publicProfile.tokens
    if (user.avatar.data) {
        publicProfile.avatar = `/users/${user.id}/avatar`
    }

    return publicProfile
}

//mongoose statics method
userSchema.statics.findByCredentials = async function (email, password) {
    const user = await User.findOne({ email })
    if (!user) {
        throw new Error('Email not match')
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
        throw new Error('Password not match')
    }
    return user
}

//mongoose middleware test (auto run) init --> validate --> remove,update,delete,save
userSchema.pre('init', async function () {
    console.log('-----------mongoose user middleware-------------')
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

// delete user tasks when user is remove (auto run)
userSchema.pre('remove', async function () {
    try {
        const user = this
        await Task.deleteMany({ owner: user._id })
        console.log('remove', user.email)
    } catch (error) {
        console.log(error)
        return
    }
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
// hash the plain text password before saving (auto run)
userSchema.pre('save', async function () {
    const user = this
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 10)
    }
    console.log('save pre')
})

const User = mongoose.model('User', userSchema)

module.exports = User

//test virtual field
async function main() {
    const user = await User.findById('627b7db563cd6d032ca6129a')

    // call populate to get virtual field
    await user.populate('tasks')
    console.log(user.tasks)
}
// main()
