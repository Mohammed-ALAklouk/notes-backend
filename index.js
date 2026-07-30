require('dotenv').config() 
const Note = require('./modules/note')
const express = require('express')
const mongoose = require('mongoose')
const app = express()

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } 

  next(error)
}


app.use(express.static('dist'))
app.use(express.json())
// this has to be the last loaded middleware, also all the routes should be registered before this!
app.use(errorHandler)


app.get('/api/notes', (request, response, next) => {
  Note.find({}).then(notes => {
    response.json(notes)
  }).catch(error => next(error))
})

app.get('/api/notes/:id', (request, response, next) => {
    const id = request.params.id
    Note.findById(id).then(note => {
        if (note) {
            response.json(note)
        } else {
            response.status(404).end()
        }
    }).catch(error => next(error))
})

app.delete('/api/notes/:id', (request, response, next) => {
    const id = request.params.id
    Note.findByIdAndRemove(id).then(() => {
        response.status(204).end()
    }).catch(error => next(error))
})

app.post('/api/notes', (request, response, next) => {
    if (request.body === undefined || request.body.content === undefined){ 
        return response.status(400).json({ error: 'content missing' })
    }
    
    const note = new Note({
        content: request.body.content,
        important: request.body.important || false,
        date: new Date(),
    })
    
    note.save().then(savedNote => {
        response.json(savedNote)
    }).catch(error => next(error))
})

app.put('/api/notes/:id', (request, response, next) => {
  const { content, important } = request.body

  Note.findById(request.params.id)
    .then(note => {
      if (!note) {
        return response.status(404).end()
      }

      note.content = content
      note.important = important

      return note.save().then((updatedNote) => {
        response.json(updatedNote)
      })
    })
    .catch(error => next(error))
})
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})  