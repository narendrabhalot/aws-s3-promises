const express = require('express');
const router = express.Router();

const userControllers = require("../Controllers/userControllers")


router.post("/register/User",userControllers.registerUser)





















module.exports = router