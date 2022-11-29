require('./mongo')

const express = require('express')
const cors = require('cors')
const app = express()
const Note = require('./models/Note')
const notFound = require('./middlewares/notFound')
const handleErrors = require('./middlewares/handleErrors')

app.use(cors())
app.use(express.json())

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/notes', (request, response) => {
  Note.find({}).then(notes => {
    response.json(notes)
  })
})

app.get('/api/notes/:id', (request, response, next) => {
  const { id } = request.params

  Note.findById(id).then(note => {
    if (note) {
      return response.json(note)
    } else {
      return response.status(404)
    }
  }).catch(error => {
    console.log(error)
    next(error)
  })
})

app.delete('/api/notes/:id', (request, response, next) => {
  const { id } = request.params

  Note.findByIdAndRemove(id).then(result => {
    response.status(204).end()
  }).catch(error => {
    next(error)
  })
})

app.post('/api/notes', (request, response) => {
  const note = request.body

  if (!note.content) {
    return response.status(400).json({
      error: 'required "content" field is missing'
    })
  }

  const newNote = new Note({
    content: note.content,
    date: new Date(),
    important: note.important || false
  })

  newNote.save().then(savedNote => {
    response.json(savedNote)
  })
})

app.put('/api/notes/:id', (request, response, next) => {
  const { id } = request.params
  const note = request.body

  const newNoteInfo = {
    content: note.content,
    important: note.important || false
  }

  Note.findByIdAndUpdate(id, newNoteInfo, { new: true })
    .then(result => {
      response.json(result)
    })
})

app.use(notFound)

app.use(handleErrors)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
