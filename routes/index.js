var express = require('express');
var router = express.Router();

//importing the models
const {Book} = require('../models/');

function asyncHandler(cb){
  return async(req, res, next) => {
    try {
      await cb(req, res, next)
    } catch(error){
      next(error);
    }
  }
}


//Home Page
router.get('/', asyncHandler(async(req, res, next) => {
  res.redirect("/books");
}));

router.get('/books', asyncHandler(async (req, res, next) => {
  
  const books = await Book.findAll();
  res.render('index', {books, title: "Library"})
}));

//Show books
router.get(
  "/books",
  asyncHandler(async (req, res) => {
    const books = await Book.findAll({ order: [["createdAt", "ASC"]] });//order by createdAt in ascending order
    res.render("index", { books, title: "Books" });
  })
);
//Add new book 
router.get( "/books/new", asyncHandler(async (req, res) => {
    res.render("new-book", { book: {}, title: "New Book" });
  })
);

//New book
router.post( "/books/new", asyncHandler(async (req, res) => {
    let book;
    try {
      book = await Book.create(req.body);
      res.redirect("/books");
    } catch (error) {
      if (error.name === "SequelizeValidationError") {
        book = await Book.build(req.body);
        res.render("new-book", {
          book,
          errors: error.errors,
          title: "New Book"
        });
      } else {
        throw error;
      }
    }
  })
);

//show book details
router.get( "/books/:id", asyncHandler(async (req, res, next) => {
    const book = await Book.findByPk(req.params.id);
    if (book) {
      res.render("update-book", { book, title: "Update Book" });
    } else {
      const err = new Error();
      err.status = 404;
      next(err);
    }
  })
);


//update book details
router.post( "/books/:id", asyncHandler(async (req, res) => {
    let book;
    try {
      book = await Book.findByPk(req.params.id);
      if (book) {
        await book.update(req.body);
        res.redirect("/books");
      }
    } catch (error) {
      if (error.name === "SequelizeValidationError") {
        book = await Book.build(req.body);
        book.id = req.params.id;
        res.render("update-book", {
          book,
          errors: error.errors,
          title: "Update Book",
          id: book.id
        });
      } else {
        throw error;
      }
    }
  })
);


//delete book
router.get( "/books/:id/delete", asyncHandler(async (req, res) => {
    const book = await Book.findByPk(req.params.id);
    res.render("delete", { book, title: "Delete Book" });
  })
);

//delete book
router.post("/books/:id/delete", asyncHandler(async (req, res) => {
    const book = await Book.findByPk(req.params.id);
    await book.destroy();
    res.redirect("/books");
  })
);

//404 HANDLER
router.use((req, res, next) => {
  const err = new Error(); //creating error object
  err.status = 404;
  next(err); //error object is passed to next function
});

//500 HANDLER
router.use((err, req, res, next) => {
  if (err.status === 404) {
    err.message = "Error no page found.";
    console.log(err.message);
    res.status(err.status);
    return res.render("page-not-found", { err });
  } else {
    err.message = "Error, no server found!";
    console.log(err.message);
    res.status(err.status);
    return res.render("error", { err });
  }
});

module.exports = router;