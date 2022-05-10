const express = require('express');
const router = express.Router();

const userControllers = require("../Controllers/userControllers")
const bookControllers = require("../Controllers/bookControllers")
const middleware= require("../middleware/auth")


//User Api

router.post("/register/User",userControllers.registerUser)
router.post("/login",userControllers.userLogIn)


//Book Api

router.post("/books",bookControllers.createBook)
router.put("/books/:bookId",middleware.authentication,bookControllers.updateBooks)


module.exports = router