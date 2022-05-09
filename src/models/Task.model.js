const mongoose = require('mongoose')
const { Schema } = mongoose

const taskSchema = new Schema(
    {
        name: { type: String, trim: true, lowercase: true, required: true },
        description: {
            type: String,
            trim: true,
            lowercase: true,
            required: true,
        },
        completed: { type: Boolean, default: false },
    },
    { timestamps: true }
)
taskSchema.pre('save', async function () {
    console.log('task middleware before save task')
})
const Task = mongoose.model('Task', taskSchema)

module.exports = Task
