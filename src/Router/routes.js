const express = require('express');
const router = express.Router();

const userControllers = require("../Controllers/userControllers")
const bookControllers = require("../Controllers/bookControllers")
const middleware = require("../middleware/auth")


//User Api

router.post("/register/User", userControllers.registerUser)
router.post("/login", userControllers.userLogIn)


//Book Api

router.post("/books",middleware.authentication , bookControllers.createBook)
router.get("/books",middleware.authentication, bookControllers.getBooks)
router.get("/books/:bookId",middleware.authentication, bookControllers.getBooksById)

router.put("/books/:bookId", middleware.authentication, bookControllers.updateBooks)
router.delete("/books/:bookId", middleware.authentication, bookControllers.deleteBooksById)


module.exports = router