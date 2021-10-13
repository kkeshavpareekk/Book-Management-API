const Router = require("express").Router();

// Database Models
const BookModel = require("../../database/book");
const AuthorModel = require("../../database/author");
const PublicationModel = require("../../database/publication");

/* 
Route               /author/
Description         get all authors
Access              PUBLIC
Parameters          None
Method              GET
*/
Router.get("/", async (request, response) => {
    const getAllAuthors = await AuthorModel.find();

    return response.json({ authors: getAllAuthors });
});

/* 
Route               /author/
Description         get specific author
Access              PUBLIC
Parameters          id
Method              GET
*/
Router.get("/:id", async (request, response) => {
    const getSpecificAuthor = await AuthorModel.findOne({
        id: parseInt(request.params.id)
    });

    if (!getSpecificAuthor) {
        return response.json({ error: `no author found for id ${request.params.id}` });
    }

    return response.json({ authors: getSpecificAuthor });
});

/* 
Route               /author/book
Description         get all authors based on book
Access              PUBLIC
Parameters          book_name
Method              GET
*/
Router.get("/book/:book_name", async (request, response) => {
    const getSpecificAuthors = await AuthorModel.findOne({
        books: request.params.book_name
    });

    if (!getSpecificAuthors) {
        return response.json({ error: `no author found for book ${request.params.book_name}` });
    }

    return response.json({ authors: getSpecificAuthors });
});

/* 
Route               author/add/
Description         add a new author to authors(table)
Access              PUBLIC
Parameters          None
Method              POST
*/
Router.post("/add/", async (request, response) => {
    const { newAuthor } = request.body;

    AuthorModel.create(newAuthor);

    return response.json({ "Authors": newAuthor, message: "new author added" });
});

/* 
Route               author/update/
Description         update name of a author
Access              PUBLIC
Parameters          id
Method              PUT
*/
Router.put("/update/:id", async (request, response) => {
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
Route               author/delete/
Description         delete a author 
Access              PUBLIC
Parameters          id
Method              DELETE
*/
Router.delete("/delete/:id", async (request, response) => {
    const deletedAuthor = await AuthorModel.findOneAndDelete({
        id: parseInt(request.params.id)
    });

    return response.json({ authors: deletedAuthor });
});

module.exports = Router;