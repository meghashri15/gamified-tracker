const Task = require('../models/Task')

exports.getTasks = async (req, res) => {
  const tasks = await Task.find({ userId: req.user.id }).sort({ createdAt: -1 })
  res.json(tasks)
}

exports.createTask = async (req, res) => {
  const task = await Task.create({ ...req.body, userId: req.user.id })
  res.json(task)
}

exports.updateTask = async (req, res) => {
  const task = await Task.findOneAndUpdate(
    { _id: req.params.id, userId: req.user.id },
    req.body, { new: true }
  )
  res.json(task)
}

exports.deleteTask = async (req, res) => {
  await Task.findOneAndDelete({ _id: req.params.id, userId: req.user.id })
  res.json({ message: 'Deleted' })
}