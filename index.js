const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");
const Person = require("./models/people");

const errorHandler = (error, req, res, next) => {
  console.log(error.message);

  if (error.name === "CastError") {
    return res.status(400).send({ error: "Id not found" });
  } else if (error.name === "ValidationError") {
    return res.status(400).json({ error: error.message });
  }
  next(error);
};

//MIDDLEWARE
app.use(express.json());
app.use(cors());
app.use(express.static("dist"));

morgan.token("body", (req) => {
  return JSON.stringify(req.body);
});

app.use(morgan(":method :url :response-time :body"));

app.get("/api/persons", (request, response) => {
  Person.find({})
    .then((people) => {
      response.json(people);
    })
    .catch((error) => {
      console.error("Error fetching data from MongoDB:", error);
      response.status(500).json({ error: "Internal server error" });
    });
});

app.get("/info", async (req, res) => {
  const date = new Date();
  Person.countDocuments({})
    .then((count) => {
      const info = `
        <div>
          <p>Phonebook has info for ${count}<p>
          <p>${date}</p>
        </div>`;
      res.send(info);
    })
    .catch((error) => {
      console.log("Error counting documents", error);
      res.status(500).json({ error: "Internal server error" });
    });
});

app.get("/api/persons/:id", (req, res, next) => {
  Person.findById(req.params.id)
    .then((person) => {
      if (person) {
        res.json(person);
      } else {
        res.status(404).end();
      }
    })
    .catch((error) => next(error));
});

app.delete("/api/persons/:id", (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then(() => {
      res.status(204).end();
    })
    .catch((error) => next(error));
});

//ADD
app.post("/api/persons", (req, res, next) => {
  const body = req.body;

  const newPerson = new Person({
    name: body.name,
    number: body.number,
  });

  newPerson
    .save()
    .then((savedPerson) => {
      res.json(savedPerson);
    })
    .catch((error) => next(error));
});

///PUT
app.put("/api/persons/:id", (req, res, next) => {

  const { name, number } = req.body;

  Person.findByIdAndUpdate(
    req.params.id,
    { name, number },
    { new: true, runValidators: true, context: "query" }
  )
    .then(updatedPerson => {
      res.json(updatedPerson);
    })
    .catch(error => next(error));
});

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`App listening port ${PORT}`);
});
