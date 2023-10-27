const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");

app.use(express.json());
app.use(cors());

morgan.token('body', req => {
  return JSON.stringify(req.body)
})


app.use(morgan(':method :url :response-time :body'))

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-1234567"
  },
  {
    id: 2,
    name: "Ada Lovelance",
    number: "123-3467723"
  },
  {
    id: 3,
    name: "Dan Abrow",
    number: "977-345-67"
  },
  {
    id: 4,
    name: "Mary Powderburn",
    number: "29-34-345-3435"
  },
];

app.get("/api/persons", (req, res) => {
  res.json(persons);
});

app.get("/info", (req, res) => {
  const date = new Date();
  const info = `
  <div>
    <p>Phonebook has info for ${persons.length}<p>
    <p>${date}</p>
  </div>`
  res.send(info)
})

app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find(person => person.id === id)
  if(person) {
    res.json(person)
  }else{
    res.status(404).end();
  }
})

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter(person => person.id !== id)
  res.status(204).end();
})

const generateId = () => {
  const newID = Math.floor(Math.random() * 5000);
  return newID
}

app.post("/api/persons", (req, res) => {

  const body = req.body;

  if(!body.name || !body.number) {
    return res.status(404).json({error: "Missing content"})
  }

  const checkName = persons.some(person => person.name === body.name)

  if(checkName) {
    return res.status(409).json({error: "Person already exist in the phonebook"})
  }

  const newPerson = {
    id: generateId(),
    name: body.name,
    number: body.number,
  }

  persons = persons.concat(newPerson);
  res.json(newPerson)
})

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`App listening port ${PORT}`);
});
