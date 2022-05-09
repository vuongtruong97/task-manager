const Task = require('../models/Task.model')
const assert = require('assert')

class TaskController {
    //[POST] /tasks
    async addTask(req, res) {
        try {
            const payload = req.body
            const newTask = new Task({
                ...payload,
            })
            await newTask.save()
            res.status(201).json(newTask)
        } catch (error) {
            return res.status(400).json(error)
        }
    }
    //[GET] /tasks
    async getAllTasks(req, res) {
        try {
            const tasks = await Task.find()
            return res.status(200).json(tasks)
        } catch (error) {
            res.status(500).json(error)
        }
    }
    //[GET] /tasks/:id
    async getTask(req, res) {
        try {
            const { id } = req.params
            const task = await Task.findById(id)
            if (!task) {
                return res.status(404).json({ error: 'Task not found' })
            }
            res.status(200).json(task)
        } catch (error) {
            res.status(500).json(error)
        }
    }
    //[PATCH] /tasks/:id
    async updateTask(req, res) {
        const updatesKey = Object.keys(req.body)
        const allowUpdate = ['name', 'completed', 'description']
        // check req update field
        const isAllow = updatesKey.every((update) =>
            allowUpdate.includes(update)
        )
        if (!isAllow) {
            return res.status(400).json({ error: 'Invalid updates!' })
        }
        try {
            const task = await Task.findById(req.params.id)
            if (!task) {
                res.status(404).json({ error: 'Task not found' })
            }
            updatesKey.forEach((update) => (task[update] = req.body[update]))
            await task.save()
            res.json(task)
        } catch (error) {
            res.status(400).send()
        }
    }
    //[DELETE] /tasks/:id
    async deleteTask(req, res) {
        try {
            const { id } = req.params
            const result = await Task.findOneAndDelete({ _id: id })
            if (result) {
                return res.status(200).json(result)
            }
            res.status(400).json({ error: 'Task not found' })
        } catch (error) {
            res.status(400).json(error)
        }
    }
    //[GET] /tasks/count
    async countTask(req, res) {
        try {
            const count = await Task.find().estimatedDocumentCount()
            res.status(200).json({ count })
        } catch (error) {
            console.log(error)
            res.status(500).send()
        }
    }
}

module.exports = new TaskController()
