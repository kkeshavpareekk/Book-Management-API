require("dotenv").config();

// import the framework
const express = require("express");
const mongoose = require("mongoose");

// Database
const database = require("./database/index");

//Models
const BookModel = require("./database/book");
const AuthorModel = require("./database/author");
const PublicationModel = require("./database/publication");


//initialising express
const app = express();

//conifgurations
app.use(express.json());

//Establish database connection
mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log("connection established"));

/* 
Route               /
Description         get all books
Access              PUBLIC
Parameters          None
Method              GET
*/
app.get("/books/", async (request, response) => {
    const getAllBooks = await BookModel.find();

    return response.json({ books: getAllBooks });
});

/*
Route               /books/
Description         get specific book based on isbn
Access              PUBLIC
Parameters          isbn
Method              GET
*/
app.get("/books/:isbn", async (request, response) => {
    const getSpecificBook = await BookModel.findOne({ ISBN: request.params.isbn });

    //if no data mongodb return NULL
    if (!getSpecificBook) {
        return response.json({ error: `no book found for isbn of ${request.params.isbn}` });
    }

    return response.json({ book: getSpecificBook });
});

/* 
Route               /books/category/
Description         get specific books based on category
Access              PUBLIC
Parameters          category
Method              GET
*/
app.get("/books/category/:category", async (request, response) => {
    const getSpecificBooks = await BookModel.findOne({
        category: request.params.category,
    });

    if (!getSpecificBooks) {
        return response.json({ error: `no book found for category of ${request.params.category}` });
    }

    return response.json({ books: getSpecificBooks });
});

/* 
Route               /books/author/
Description         get specific books based on author 
Access              PUBLIC
Parameters          author_id
Method              GET
*/
app.get("/books/author/:author_id", async (request, response) => {
    const getSpecificBooks = await BookModel.findOne({
        authors: parseInt(request.params.author_id)
    });

    if (!getSpecificBooks) {
        return response.json({ error: `no book found for author of id ${request.params.author_id}` });
    }

    return response.json({ books: getSpecificBooks });
});


/* 
Route               /authors/
Description         get all authors
Access              PUBLIC
Parameters          None
Method              GET
*/
app.get("/authors/", async (request, response) => {
    const getAllAuthors = await AuthorModel.find();

    return response.json({ authors: getAllAuthors });
});

/* 
Route               /authors/
Description         get specific author
Access              PUBLIC
Parameters          id
Method              GET
*/
app.get("/authors/:id", async (request, response) => {
    const getSpecificAuthor = await AuthorModel.findOne({
        id: parseInt(request.params.id)
    });

    if (!getSpecificAuthor) {
        return response.json({ error: `no author found for id ${request.params.id}` });
    }

    return response.json({ authors: getSpecificAuthor });
});

/* 
Route               /authors/
Description         get all authors based on book
Access              PUBLIC
Parameters          book_name
Method              GET
*/
app.get("/authors/book/:book_name", async (request, response) => {
    const getSpecificAuthors = await AuthorModel.findOne({
        books: request.params.book_name
    });

    if (!getSpecificAuthors) {
        return response.json({ error: `no author found for book ${request.params.book_name}` });
    }

    return response.json({ authors: getSpecificAuthors });
});

/* 
Route               /publications/
Description         get all publications
Access              PUBLIC
Parameters          None
Method              GET
*/
app.get("/publications/", async (request, response) => {
    const getAllPublications = await PublicationModel.find();

    return response.json({ publications: getAllPublications });
});

/* 
Route               /publications/
Description         get specific publications
Access              PUBLIC
Parameters          id
Method              GET
*/
app.get("/publications/:id", async (request, response) => {
    const getSpecificPublication = await PublicationModel.findOne({
        id: parseInt(request.params.id)
    });

    if (!getSpecificPublication) {
        return response.json({ error: `no publication found for id of ${request.params.id}` });
    }

    return response.json({ publications: getSpecificPublication });
});

/* 
Route               /publications/
Description         get specific publications based on book
Access              PUBLIC
Parameters          book_name
Method              GET
*/
app.get("/publications/book/:book_name", async (request, response) => {
    const getSpecificPublication = await PublicationModel.findOne({
        books: request.params.book_name
    });

    if (!getSpecificPublication) {
        return response.json({ error: `no publication found for book  ${request.params.book_name}` });
    }

    return response.json({ publications: getSpecificPublication });
});

/* 
Route               /add/book/
Description         add a new book to books(table)
Access              PUBLIC
Parameters          NONE
Method              POST
*/
app.post("/add/book/", async (request, response) => {
    const { newBook } = request.body;

    BookModel.create(newBook);

    return response.json({ books: newBook, message: "new book added" });
});

/* 
Route               /add/author/
Description         add a new author to authors(table)
Access              PUBLIC
Parameters          None
Method              POST
*/
app.post("/add/author/", async (request, response) => {
    const { newAuthor } = request.body;

    AuthorModel.create(newAuthor);

    return response.json({ "Authors": newAuthor, message: "new author added" });
});

/* 
Route               /add/publication
Description         add a new publication to publications(table)
Access              PUBLIC
Parameters          None
Method              POST
*/
app.post("/add/publication/", async (request, response) => {
    const { newPublication } = request.body;

    PublicationModel.create(newPublication);

    return response.json({ "Publications": newPublication, message: "new publication added" });
});

/* 
Route               /update/book/
Description         update title of a book
Access              PUBLIC
Parameters          isbn
Method              PUT
*/
app.put("/update/book/:isbn", async (request, response) => {
    const updatedBook = await BookModel.findOneAndUpdate({
        ISBN: request.params.isbn
    },
        {
            title: request.body.bookTitle
        },
        {
            new: true
        });

    return response.json({ books: updatedBook });

});

/* 
Route               /update/book/author
Description         update author of a book
Access              PUBLIC
Parameters          isbn
Method              PUT
*/
app.put("/update/book/author/:isbn", async (request, response) => {
    const updatedBook = await BookModel.findOneAndUpdate({
        ISBN: request.params.isbn
    },
        {
            $addToSet: {
                authors: request.body.authorID
            }
        },
        {
            new: true
        });

    const updatedAuthor = await AuthorModel.findOneAndUpdate({
        id: request.body.authorID
    },
        {
            $addToSet: {
                books: request.params.isbn
            }
        },
        {
            new: true
        });

    return response.json({ books: updatedBook, authors: updatedAuthor, message: "new author was added" });
});

/* 
Route               /update/author/
Description         update name of a author
Access              PUBLIC
Parameters          id
Method              PUT
*/
app.put("/update/author/:id", async (request, response) => {
    const updatedAuthor = await AuthorModel.findOneAndUpdate({
        id: parseInt(request.params.id)
    },
        {
            name: request.body.authorName
        },
        {
            new: true
        })

    return response.json({ authors: updatedAuthor });
});

/* 
Route               /update/publication/
Description         update name of a publication
Access              PUBLIC
Parameters          id
Method              PUT
*/
app.put("/update/publication/:id", async (request, response) => {
    const updatedPublication = await PublicationModel.findOneAndUpdate({
        id: parseInt(request.params.id)
    },
        {
            name: request.body.publicationName
        },
        {
            new: true
        })

    return response.json({ authors: updatedPublication });
});

/* 
Route               /update/publication/book/
Description         update book printed by a publication
Access              PUBLIC
Parameters          isbn
Method              PUT
*/
app.put("/update/publication/book/:isbn", async (request, response) => {
    const updatedPublication = await PublicationModel.findOneAndUpdate({
        id: parseInt(request.body.publicationID)
    },
        {
            $addToSet: {
                books: request.params.isbn
            }
        },
        {
            new: true
        });

    const updatedBook = await BookModel.findOneAndUpdate({
        ISBN: request.params.isbn
    },
        {
            publication: parseInt(request.body.publicationID)
        },
        {
            new: true
        });

    return response.json({ publications: updatedPublication, books: updatedBook, message: "publication books updated" });
});

/* 
Route               /delete/book/
Description         delete a book
Access              PUBLIC
Parameters          isbn
Method              DELETE
*/
app.delete("/delete/book/:isbn", async (request, response) => {
    const deletedBook = await BookModel.findOneAndDelete({
        ISBN: request.params.isbn
    });

    return response.json({ books: deletedBook });
});

/* 
Route               /delete/book/author
Description         delete a author from a book
Access              PUBLIC
Parameters          isbn, authorID
Method              DELETE
*/
app.delete("/delete/book/author/:isbn/:authorID", async (request, response) => {
    const updatedBook = await BookModel.findOneAndUpdate({
        ISBN: request.params.isbn
    },
        {
            $pull: {
                authors: parseInt(request.params.authorID)
            }
        },
        {
            new: true
        });

    const updatedAuthor = await AuthorModel.findOneAndUpdate({
        id: parseInt(request.params.authorID)
    },
        {
            $pull: {
                books: request.params.isbn
            }
        },
        {
            new: true
        });

    return response.json({ books: updatedBook, authors: updatedAuthor });
});

/* 
Route               /delete/author/
Description         delete a author 
Access              PUBLIC
Parameters          id
Method              DELETE
*/
app.delete("/delete/author/:id", async (request, response) => {
    const deletedAuthor = await AuthorModel.findOneAndDelete({
        id: parseInt(request.params.id)
    });

    return response.json({ authors: deletedAuthor });
});

/* 
Route               /delete/publication/
Description         delete a publication 
Access              PUBLIC
Parameters          id
Method              DELETE
*/
app.delete("/delete/publication/:id", async (request, response) => {
    const deletedPublication = await PublicationModel.findOneAndDelete({
        id: parseInt(request.params.id)
    });

    return response.json({ publications: deletedPublication });
});

/* 
Route               /delete/publication/book/
Description         delete a book from publication 
Access              PUBLIC
Parameters          id, isbn
Method              DELETE
*/
app.delete("/delete/publication/book/:id/:isbn", async (request, response) => {
    const updatedPublication = await PublicationModel.findOneAndUpdate({
        id: parseInt(request.params.id)
    },
        {
            $pull: {
                books: request.params.isbn
            }
        },
        {
            new: true
        });

    const updatedBook = await BookModel.findOneAndUpdate({
        ISBN: request.params.isbn
    },
        {
            publication: 0
        },
        {
            new: true
        });

    return response.json({ books: updatedBook, publications: updatedPublication });
})

app.listen(3000, () => console.log("server running"));