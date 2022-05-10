const express = require('express');
const router = express.Router();




const userControllers = require("../Controllers/userControllers")









router.post("/register/User",userControllers.registerUser)
router.post("/login",userControllers.userLogIn)




















module.exports = router