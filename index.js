const express = require('express')
const cors = require('cors')
const app = express()
app.use(express.json())
app.use(express.static('dist'))
app.use(cors())

let notes = [
  {
    id: "1",
    content: "HTML is easy",
    important: true
  },
  {
    id: "2",
    content: "Browser can execute only JavaScript",
    important: false
  },
  {
    id: "3",
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true
  }
]
app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/notes', (request, response) => {
    response.json(notes)
})

app.get('/api/notes/:id', (request, response) => {
    let id = request.params.id
    let note = notes.find(note => note.id === id) 
    if (note){
        response.json(note)
    }
    else {
        response.status(404).end()
    }
})

app.delete('/api/notes/:id', (request, response) => {
    let id = request.params.id
    notes = notes.filter(note => note.id !== id)
    response.status(204).end()
})

app.post('/api/notes', (request, response) => {
    if (request.body === undefined || request.body.content === undefined){ 
        return response.status(400).json({ error: 'content missing' })
    }
    
    const id = (Math.random() * 100000).toFixed(0)
    const note = {
        id: id,
        content: request.body.content,
        important: request.body.important || false
    }
    notes = notes.concat(note)
    response.json(note)
})

app.put('/api/notes/:id', (request, response) => {
    if (request.body === undefined || request.body.content === undefined){ 
        return response.status(400).json({ error: 'content missing' })
    }

    const id = request.params.id
    if (!notes.find(note => note.id === id)){
        return response.status(404).json({ error: 'note not found' })
    }

    const note = {
        id: id,
        content: request.body.content,
        important: request.body.important || false
    }
    notes = notes.map(n => n.id !== id ? n : note)
    response.json(note)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})  