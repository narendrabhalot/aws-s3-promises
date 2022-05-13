const express = require('express');
const router = express.Router();

const userControllers = require("../Controllers/userControllers")
const bookControllers = require("../Controllers/bookControllers")
const reviewController= require("../Controllers/reviewController")
const middleware = require("../middleware/auth");



//User Api

router.post("/register/User", userControllers.registerUser)
router.post("/login", userControllers.userLogIn)


//Book Api

router.post("/books",middleware.authentication , bookControllers.createBook)
router.get("/books",middleware.authentication, bookControllers.getBooks)
router.get("/books/:bookId",middleware.authentication, bookControllers.getBooksById)

router.put("/books/:bookId", middleware.authentication, bookControllers.updateBooks)
router.delete("/books/:bookId", middleware.authentication, bookControllers.deleteBooksById)



//Review Api

router.post("/books/:bookId/review",reviewController.createReview)
router.put("/books/:bookId/review/:reviewId",reviewController.updateReview)
router.delete("books/:bookId/review/:reviewId",reviewController.deletedReviews)


module.exports = router