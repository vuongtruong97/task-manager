const mongoose = require('mongoose')
const { Schema } = mongoose

const taskSchema = new Schema(
    {
        name: { type: String, trim: true, lowercase: true, required: true },
        description: { type: String, trim: true, lowercase: true, required: true },
        completed: { type: Boolean, default: false },
        //set owner with type ObjectId
        owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    },
    { timestamps: true }
)

// mongoose middleware
taskSchema.pre('init', async function () {
    console.log('init task')
})
taskSchema.post('init', async function () {
    console.log('init task')
})

taskSchema.pre('validate', async function () {
    console.log('validate task')
})
taskSchema.post('validate', async function () {
    console.log('validate task')
})

taskSchema.pre('save', async function () {
    console.log('save task')
})
taskSchema.post('save', async function () {
    console.log('save task')
})

taskSchema.pre('remove', async function () {
    console.log('remove task')
})
taskSchema.post('remove', async function () {
    console.log('remove task')
})

const Task = mongoose.model('Task', taskSchema)

module.exports = Task
