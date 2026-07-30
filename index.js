require('dotenv').config() 
const Note = require('./modules/note')
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const app = express()
app.use(express.json())
app.use(express.static('dist'))
app.use(cors())

let notes = []

app.get('/api/notes', (request, response) => {
  Note.find({}).then(notes => {
    response.json(notes)
  })
})

app.get('/api/notes/:id', (request, response) => {
    const id = request.params.id
    Note.findById(id).then(note => {
        response.json(note)
    })
})

app.delete('/api/notes/:id', (request, response) => {
    const id = request.params.id
    Note.findByIdAndRemove(id).then(() => {
        response.status(204).end()
    })
})

app.post('/api/notes', (request, response) => {
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
    })
})

app.put('/api/notes/:id', (request, response) => {
    if (request.body === undefined || request.body.content === undefined){ 
        return response.status(400).json({ error: 'content missing' })
    }

    const id = request.params.id
    const note = {
        content: request.body.content,
        important: request.body.important || false
    }

    Note.findByIdAndUpdate(id, note, { new: true }).then(updatedNote => {
        response.json(updatedNote)
    })

})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})  