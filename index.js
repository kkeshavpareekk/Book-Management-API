// import the framework
const express = require("express");

// Database
const database = require("./database/index");

//initialising express
const app = express();

//conifgurations
app.use(express.json());

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


app.listen(3000, () => console.log("server running"));