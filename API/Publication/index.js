const Router = require("express").Router();

// Database Models
const BookModel = require("../../database/book");
const AuthorModel = require("../../database/author");
const PublicationModel = require("../../database/publication");

/* 
Route               /publication/
Description         get all publications
Access              PUBLIC
Parameters          None
Method              GET
*/
Router.get("/", async (request, response) => {
    const getAllPublications = await PublicationModel.find();

    return response.json({ publications: getAllPublications });
});

/* 
Route               /publication/
Description         get specific publications
Access              PUBLIC
Parameters          id
Method              GET
*/
Router.get("/:id", async (request, response) => {
    const getSpecificPublication = await PublicationModel.findOne({
        id: parseInt(request.params.id)
    });

    if (!getSpecificPublication) {
        return response.json({ error: `no publication found for id of ${request.params.id}` });
    }

    return response.json({ publications: getSpecificPublication });
});

/* 
Route               /publication/book
Description         get specific publications based on book
Access              PUBLIC
Parameters          book_name
Method              GET
*/
Router.get("/book/:book_name", async (request, response) => {
    const getSpecificPublication = await PublicationModel.findOne({
        books: request.params.book_name
    });

    if (!getSpecificPublication) {
        return response.json({ error: `no publication found for book  ${request.params.book_name}` });
    }

    return response.json({ publications: getSpecificPublication });
});

/* 
Route               publication/add
Description         add a new publication to publications(table)
Access              PUBLIC
Parameters          None
Method              POST
*/
Router.post("/add/", async (request, response) => {
    const { newPublication } = request.body;

    PublicationModel.create(newPublication);

    return response.json({ "Publications": newPublication, message: "new publication added" });
});

/* 
Route               publication/update/
Description         update name of a publication
Access              PUBLIC
Parameters          id
Method              PUT
*/
Router.put("/update/:id", async (request, response) => {
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
Route               publication/update/book/
Description         update book printed by a publication
Access              PUBLIC
Parameters          isbn
Method              PUT
*/
Router.put("/update/book/:isbn", async (request, response) => {
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
Route               publication/delete/
Description         delete a publication 
Access              PUBLIC
Parameters          id
Method              DELETE
*/
Router.delete("/delete/:id", async (request, response) => {
    const deletedPublication = await PublicationModel.findOneAndDelete({
        id: parseInt(request.params.id)
    });

    return response.json({ publications: deletedPublication });
});

/* 
Route               publication/delete/book/
Description         delete a book from publication 
Access              PUBLIC
Parameters          id, isbn
Method              DELETE
*/
Router.delete("/delete/book/:id/:isbn", async (request, response) => {
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
});

module.exports = Router;