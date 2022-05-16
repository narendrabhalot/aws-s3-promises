const express = require('express');
const router = express.Router();

const userControllers = require("../Controllers/userControllers")
const bookControllers = require("../Controllers/bookControllers")
const reviewController= require("../Controllers/reviewController")
const authentication = require("../middleware/authentication");



//User Api

router.post("/register", userControllers.registerUser)
router.post("/login", userControllers.userLogIn)


//Book Api

router.post("/books",authentication, bookControllers.createBook)
router.get("/books",authentication, bookControllers.getBooks)
router.get("/books/:bookId",authentication, bookControllers.getBooksById)

router.put("/books/:bookId", authentication, bookControllers.updateBooks)
router.delete("/books/:bookId", authentication, bookControllers.deleteBooksById)



//Review Api

router.post("/books/:bookId/review",reviewController.createReview)
router.put("/books/:bookId/review/:reviewId",reviewController.updateReview)
router.delete("/books/:bookId/review/:reviewId",reviewController.deletedReviews)


module.exports = router