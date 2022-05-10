const express = require('express');
const router = express.Router();




const userControllers = require("../Controllers/userControllers")
const bookController = require("../Controllers/bookControllers")






//User Api

router.post("/register/User",userControllers.registerUser)
router.post("/login",userControllers.userLogIn)




//Book Api

router.post("/books",bookController.createBook)




















module.exports = router