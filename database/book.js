const mongoose = require("mongoose");


// creating a book schema
const BookSchema = mongoose.Schema({
    ISBN: {
        type: String,
        required: true,
        minLength: 8,
        maxLength: 10

    },
    title: String,
    authors: [Number],
    language: String,
    pubDate: String,
    numOfPage: Number,
    category: [String],
    publication: Number,
});

//create a book model using the bookSchema
const BookModel = mongoose.model("books", BookSchema);

module.exports = BookModel;