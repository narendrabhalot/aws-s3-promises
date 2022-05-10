const express = require('express');
const router = express.Router();




const userControllers = require("../Controllers/userControllers")
const bookControllers = require("../Controllers/bookControllers")









router.post("/register/User",userControllers.registerUser)
router.post("/login",userControllers.userLogIn)
router.put("/books/:bookId",bookControllers.updateBooks)




















module.exports = router