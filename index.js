require("dotenv").config();

// import the framework
const express = require("express");
const mongoose = require("mongoose");

// Database
const database = require("./database/index");

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
app.get("/books/", (request, response) => {
    return response.json({ books: database.books });
});

/* 
Route               /books/
Description         get specific book based on isbn
Access              PUBLIC
Parameters          isbn
Method              GET
*/
app.get("/books/:isbn", (request, response) => {
    const getSpecificBook = database.books.filter(({ ISBN }) => ISBN === request.params.isbn);

    if (getSpecificBook.length === 0) {
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
app.get("/books/category/:category", (request, response) => {
    const getSpecificBooks = database.books.filter(
        (book) => book.category.includes(request.params.category)
    );

    if (getSpecificBooks.length === 0) {
        return response.json({ error: `no book found for category of ${request.params.category}` });
    }

    return response.json({ books: getSpecificBooks });
});

/* 
Route               /books/author/
Description         get specific books based on author id
Access              PUBLIC
Parameters          author_id
Method              GET
*/
app.get("/books/author/:author_id", (request, response) => {
    const getSpecificBooks = database.books.filter(
        ({ authors }) => authors.includes(parseInt(request.params.author_id))
    );

    if (getSpecificBooks.length === 0) {
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
app.get("/authors/", (request, response) => {
    return response.json({ authors: database.authors });
});

/* 
Route               /authors/
Description         get specific author
Access              PUBLIC
Parameters          id
Method              GET
*/
app.get("/authors/:id", (request, response) => {
    const getSpecificAuthor = database.authors.filter(({ id }) => id === parseInt(request.params.id));

    if (getSpecificAuthor.length === 0) {
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
app.get("/authors/book/:book_name", (request, response) => {
    const getSpecificAuthors = database.authors.filter(
        ({ books }) => books.includes(request.params.book_name)
    );

    if (getSpecificAuthors.length === 0) {
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
app.get("/publications/", (request, response) => {
    return response.json({ publications: database.publications });
});

/* 
Route               /publications/
Description         get specific publications
Access              PUBLIC
Parameters          id
Method              GET
*/
app.get("/publications/:id", (request, response) => {
    const getSpecificPublication = database.publications.filter(({ id }) => id === parseInt(request.params.id));

    if (getSpecificPublication.length === 0) {
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
app.get("/publications/book/:book_name", (request, response) => {
    const getSpecificPublication = database.publications.filter(
        ({ books }) => books.includes(request.params.book_name)
    );

    if (getSpecificPublication.length === 0) {
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
app.post("/add/book/", (request, response) => {
    const { newBook } = request.body;

    database.books.push(newBook);

    return response.json({ books: database.books, message: "new book added" });
});

/* 
Route               /add/author/
Description         add a new author to authors(table)
Access              PUBLIC
Parameters          None
Method              POST
*/
app.post("/add/author/", (request, response) => {
    const { newAuthor } = request.body;

    database.authors.push(newAuthor);

    return response.json({ "Authors": database.authors, message: "new author added" });
});

/* 
Route               /add/publication
Description         add a new publication to publications(table)
Access              PUBLIC
Parameters          None
Method              POST
*/
app.post("/add/publication/", (request, response) => {
    const { newPublication } = request.body;

    database.publications.push(newPublication);

    return response.json({ "Publications": database.publications, message: "new publication added" });
});

/* 
Route               /update/book/
Description         updata title of a book
Access              PUBLIC
Parameters          isbn
Method              PUT
*/
app.put("/update/book/:isbn", (request, response) => {
    database.books.forEach((book) => {
        if (book.ISBN === request.params.isbn) {
            book.title = request.body.bookTitle;
            return;
        }
    });

    return response.json({ books: database.books });

});

/* 
Route               /update/book/author
Description         update author of a book
Access              PUBLIC
Parameters          isbn
Method              PUT
*/
app.put("/update/book/author/:isbn", (request, response) => {
    database.books.forEach((book) => {
        if (request.params.isbn === book.ISBN) {
            book.authors.push(request.body.authorID);
            return;
        }
    });

    database.authors.forEach((author) => {
        if (author.id == request.body.authorID) {
            author.books.push(request.params.isbn);
            return;
        }
    });

    return response.json({ books: database.books, authors: database.authors, message: "new author was added" });
});

/* 
Route               /update/author/
Description         update name of a author
Access              PUBLIC
Parameters          id
Method              PUT
*/
app.put("/update/author/:id", (request, response) => {
    database.authors.forEach((author) => {
        if (author.id === parseInt(request.params.id)) {
            author.name = request.body.authorName;
            return;
        }
    });

    return response.json({ authors: database.authors });
});

/* 
Route               /update/publication/
Description         update name of a publication
Access              PUBLIC
Parameters          id
Method              PUT
*/
app.put("/update/publication/:id", (request, response) => {
    database.publications.forEach((publication) => {
        if (publication.id === parseInt(request.params.id)) {
            publication.name = request.body.publicationName;
            return;
        }
    });

    return response.json({ authors: database.publications });
});

/* 
Route               /update/publication/book/
Description         update book printed by a publication
Access              PUBLIC
Parameters          isbn
Method              PUT
*/
app.put("/update/publication/book/:isbn", (request, response) => {
    database.publications.forEach((publication) => {
        if (publication.id === request.body.pubID) {
            publication.books.push(request.params.isbn);
            return;
        }
    });

    database.books.forEach((book) => {
        if (book.ISBN === request.params.isbn) {
            book.publication = request.body.pubID;
            return;
        }
    });

    return response.json({ publications: database.publications, books: database.books, message: "publication books updated" });
});

/* 
Route               /delete/book/
Description         delete a book
Access              PUBLIC
Parameters          isbn
Method              DELETE
*/
app.delete("/delete/book/:isbn", (request, response) => {
    const updatedBookDatabase = database.books.filter((book) => book.ISBN !== request.params.isbn);

    database.books = updatedBookDatabase;

    return response.json({ books: database.books });
});

/* 
Route               /delete/book/author
Description         delete a author from a book
Access              PUBLIC
Parameters          isbn, authorID
Method              DELETE
*/
app.delete("/delete/book/author/:isbn/:authorID", (request, response) => {
    database.books.forEach((book) => {
        if (book.ISBN === request.params.isbn) {
            book.authors = book.authors.filter((author) => author !== parseInt(request.params.authorID));
            return;
        }
    });

    database.authors.forEach((author) => {
        if (author.id == parseInt(request.params.authorID)) {
            author.books = author.books.filter((book) => book === request.params.isbn);
            return;
        }
    });

    return response.json({ books: database.books, authors: database.authors });
});

/* 
Route               /delete/author/
Description         delete a author 
Access              PUBLIC
Parameters          id
Method              DELETE
*/
app.delete("/delete/author/:id", (request, response) => {
    database.authors = database.authors.filter((author) => author.id !== parseInt(request.params.id));

    return response.json({ authors: database.authors });
});

/* 
Route               /delete/publication/
Description         delete a publication 
Access              PUBLIC
Parameters          id
Method              DELETE
*/
app.delete("/delete/publication/:id", (request, response) => {
    database.publications = database.publications.filter((publication) => publication.id !== parseInt(request.params.id));

    return response.json({ publications: database.publications });
});

/* 
Route               /delete/publication/book/
Description         delete a book from publication 
Access              PUBLIC
Parameters          id, isbn
Method              DELETE
*/
app.delete("/delete/publication/book/:id/:isbn", (request, response) => {
    database.publications.forEach((publication) => {
        if (publication.id === parseInt(request.params.id)) {
            publication.books = publication.books.filter((book) => book !== request.params.isbn);
        }
    });

    database.books.forEach((book) => {
        if (book.isbn === request.params.isbn) {
            book.publication = 0;
        }
    });

    return response.json({ books: database.books, publications: database.publications });
})

app.listen(3000, () => console.log("server running"));