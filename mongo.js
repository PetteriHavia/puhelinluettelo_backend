const mongoose = require("mongoose");
require("dotenv").config();

const pass = process.argv[2];

if(!(process.argv.length === 5 || process.argv.length === 3)) {
  console.log("Use Cases: ")
  console.log("node mongo.js <password> - List all database items");
  console.log("node mongo.js <password> <name> <number> - Add new user to phonebook");
  process.exit(1);
}

const url = process.env.MONGO_URI;

mongoose.set("strictQuery", false);
mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Person", personSchema);

if (process.argv.length === 5) {
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4],
  });

  person.save().then((result) => {
    console.log(`added ${person.name} number ${person.number} to phonebook`);
    mongoose.connection.close();
  });
} else {
  console.log("Phoneboook: ");
  Person.find({}).then((result) => {
    result.forEach((item) => {
      console.log(item.name, item.number);
    });
    mongoose.connection.close();
  });
}
