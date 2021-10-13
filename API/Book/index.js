const Router = require("express").Router();

// Database Models
const BookModel = require("../../database/book");
const AuthorModel = require("../../database/author");
const PublicationModel = require("../../database/publication");

/* 
Route               /
Description         get all books
Access              PUBLIC
Parameters          None
Method              GET
*/
Router.get("/", async (request, response) => {
    const getAllBooks = await BookModel.find();

    return response.json({ books: getAllBooks });
});

/*
Route               /book/
Description         get specific book based on isbn
Access              PUBLIC
Parameters          isbn
Method              GET
*/
Router.get("/:isbn", async (request, response) => {
    const getSpecificBook = await BookModel.findOne({ ISBN: request.params.isbn });

    //if no data mongodb return NULL
    if (!getSpecificBook) {
        return response.json({ error: `no book found for isbn of ${request.params.isbn}` });
    }

    return response.json({ book: getSpecificBook });
});

/* 
Route               /book/category/
Description         get specific books based on category
Access              PUBLIC
Parameters          category
Method              GET
*/
Router.get("/category/:category", async (request, response) => {
    const getSpecificBooks = await BookModel.findOne({
        category: request.params.category,
    });

    if (!getSpecificBooks) {
        return response.json({ error: `no book found for category of ${request.params.category}` });
    }

    return response.json({ books: getSpecificBooks });
});

/* 
Route               /book/author/
Description         get specific books based on author 
Access              PUBLIC
Parameters          author_id
Method              GET
*/
Router.get("/author/:author_id", async (request, response) => {
    const getSpecificBooks = await BookModel.findOne({
        authors: parseInt(request.params.author_id)
    });

    if (!getSpecificBooks) {
        return response.json({ error: `no book found for author of id ${request.params.author_id}` });
    }

    return response.json({ books: getSpecificBooks });
});

/* 
Route               /book/add/
Description         add a new book to books(table)
Access              PUBLIC
Parameters          NONE
Method              POST
*/
Router.post("/add/", async (request, response) => {
    const { newBook } = request.body;

    BookModel.create(newBook);

    return response.json({ books: newBook, message: "new book added" });
});

/* 
Route               /book/update/
Description         update title of a book
Access              PUBLIC
Parameters          isbn
Method              PUT
*/
Router.put("/update/:isbn", async (request, response) => {
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
Route               book/update/author
Description         update author of a book
Access              PUBLIC
Parameters          isbn
Method              PUT
*/
Router.put("/update/author/:isbn", async (request, response) => {
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
Route               book/delete/
Description         delete a book
Access              PUBLIC
Parameters          isbn
Method              DELETE
*/
Router.delete("/delete/:isbn", async (request, response) => {
    const deletedBook = await BookModel.findOneAndDelete({
        ISBN: request.params.isbn
    });

    return response.json({ books: deletedBook });
});

/* 
Route               /book/delete/author
Description         delete a author from a book
Access              PUBLIC
Parameters          isbn, authorID
Method              DELETE
*/
Router.delete("/delete/author/:isbn/:authorID", async (request, response) => {
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

module.exports = Router;