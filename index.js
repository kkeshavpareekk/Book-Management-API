require("dotenv").config();

// import the framework
const express = require("express");

const mongoose = require("mongoose");

//Microservices Routes
const Books = require("./API/Book");
const Authors = require("./API/Publication");
const Publications = require("./API/Author");

//initialising express
const app = express();

//conifgurations
app.use(express.json());

//Establish database connection
mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log("connection established"));

//Initializing Microservices
app.use("/book", Books);
app.use("/author", Authors);
app.use("/publication", Publications);

app.listen(3000, () => console.log("server running"));