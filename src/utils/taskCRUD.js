const Task = require('../models/Task.model')
const deleteTaskAndCount = async (id) => {
    await Task.findOneAndDelete({ _id: id })
    const incompletedTask = await Task.countDocuments({ completed: false })
    return incompletedTask
}

module.exports = {
    deleteTaskAndCount,
}
