const express = require('express')
const cors = require('cors')

const PORT = process.env.PORT || 3000

var morgan = require('morgan')
const app = express()

app.use(cors())

app.use(express.static('dist'))

let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.use(express.json())

//app.use(morgan('combined'))

morgan.token('content', function (req, res) {
    //console.log('logger: ', req.body)
    return JSON.stringify(req.body)
})

app.use(morgan(function (tokens, req, res) {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'), '-',
      tokens['response-time'](req, res), 'ms',
      tokens['content'](req, res)
    ].join(' ')
  }))

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/info', (request, response) => {
    const date = new Date();
    response.send(
        `<p>Phonebook has info for ${persons.length} people</p><p>${date}</p>`
    )
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(person => person.id === id)
    
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
  })

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    console.log(`Deleting person with id: ${id}`)
    persons = persons.filter(person => person.id !== id)
  
    response.status(204).end()
  })

function generateId() {
    // generate numbers between 0 and 10.000
    // another solution it's to use Number.MAX_VALUE
    const id = String(Math.floor(Math.random() * 10000)) 
    //console.log(`generated id: ${id}`)
    return id
}

app.post('/api/persons', (request, response) => {
    const body = request.body
  
    // check if values missing
    if (!body.name || !body.number) {
        console.log("name or number is missing")
        return response.status(400).json({ 
            error: 'name or number is missing' 
        })
    }

    // check if name it's already in the phonebook
    const found = persons.filter(person => person.name === body.name)
    //console.log(found)
    if(found.length > 0) {
        return response.status(400).json({ 
            error: 'name must be unique'
        })
    }

    const person = {
        id: generateId(),
        name: body.name,
        number: body.number,
    }

    //console.log(person)
  
    persons = persons.concat(person)
  
    response.json(person)
    
    response.status(204).end()
  })


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})