const mongoose = require('mongoose');
require('dotenv').config();


if(process.argv.length < 3) {
    console.log("Give password as argument");
}

const password = process.argv[2];

const url = `mongodb+srv://${process.env.USER}:${process.env.MONGO_KEY}@cluster0.8iuddml.mongodb.net/`;
console.log(url)