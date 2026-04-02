const express  = require('express')
const mongoose = require('mongoose')
const cors     = require('cors')
require('dotenv').config()

const app = express()

app.use(cors({
  origin: '*'
}))
app.use(express.json())

app.use('/api/auth',  require('./routes/auth'))
app.use('/api/tasks', require('./routes/tasks'))
app.use('/api/user',  require('./routes/user'))

app.get('/', (req, res) => res.json({ message: 'API running' }))

const PORT = process.env.PORT || 5000

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected')
    app.listen(PORT, () => {
      console.log(`Server on port ${PORT}`)
    })
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err)
    process.exit(1)
  })