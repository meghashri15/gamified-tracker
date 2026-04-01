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

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected')
    app.listen(process.env.PORT || 5000, () => {
      console.log(`Server on port ${process.env.PORT || 5000}`)
    })
  })
  .catch((err) => {
    console.error(err)
  })