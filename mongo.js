const mongoose = require('mongoose')

const password = 'root'
const database = 'joakidb'

const connectionString = `mongodb+srv://root:${password}@cluster0.sk0yb.mongodb.net/${database}?retryWrites=true&w=majority`

mongoose.connect(connectionString)
  .then(() => {
    console.log('Database connected successfuly :)')
  }).catch(err => {
    console.error(err)
  })
