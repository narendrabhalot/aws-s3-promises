const jwt = require("jsonwebtoken");
const userModels = require("../models/userModels.js");
const validator = require('validator');
const { use } = require("../Router/routes.js");


const isValid = function (value) {
  if (typeof value === "undefined" || value === null) return false;
  if (typeof value === "string" && value.trim().length === 0) return false;
  return true;
};
const isValidRequestBody = function (requestBody) {
  return Object.keys(requestBody).length > 0
}
const isValidObjectId = function (objectId) {
  return mongoose.Types.ObjectId.isValid(objectId)
}

////////////////////----CREATING USER-----/////////////////////

const registerUser = async function (req, res) {

  try {
    let data = req.body

    if (Object.keys(data).length == 0) {
      res.status(400).send({ status: false, msg: "data not found, Please give the data" })

    } else {

      const { title, name, email, password, address, phone } = data
      const checkTitle = data.title
      if (checkTitle) {
        if (checkTitle == "Mr" || checkTitle == "Mrs" || checkTitle == "Miss")

          if (!isValid(title)) {
            return res.status(400).send({ status: false, msg: "title is required" })
          }


        if (!isValid(name)) {
          return res.status(400).send({ status: false, msg: "name is required" })
        }

        if (!isValid(email)) {
          return res.status(400).send({ status: false, msg: "email is required" })
        }

        if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
          return res.status(400).send({ status: false, msg: "please enter a valid email" })
        }

        let isuserpresent = await userModels.findOne({ email: email })
        console.log(isuserpresent)
        if (isuserpresent) {
          return res.status(400).send({ status: false, msg: "email already present" })
        }

        if (!isValid(password)) {
          return res.status(400).send({ status: false, msg: "password is required" })
        }
        if (!(password.length >= 8 && password.length <= 15)) {
          return res.status(400).send({ status: false, msg: "passwords length b/w 8-15" })
        }

        if (!isValid(address)) {
          return res.status(400).send({ status: false, msg: "address is required" })
        }
        if (!isValid(phone)) {
          return res.status(400).send({ status: false, msg: "phone number is required" })
        }

        if (!/^(\+\d{1,3}[- ]?)?\d{10}$/.test(phone)) {
          return res.status(400).send({ status: false, msg: "please enter a valid phone number" })
        }
        let usedphone = await userModels.findOne({ phone: phone })
        console.log(usedphone)
        if (usedphone) {
          return res.status(400).send({ status: false, msg: "phone no. already present" })
        }
        let saveData = await userModels.create(data)
        return res.status(201).send({ status: true, msg: saveData })

      }

    }
  } catch (error) {
    console.log(error)
    return res.status(500).send({ status: false, msg: "error", error: error.message })

  }
}


//////////////////////////////////--USER LOGIN---///////////////////////////// 



const userLogIn = async function (req, res) {

  try {
    const email = req.body.email;
    const password = req.body.password;

    if (!email) {
      return res.status(400).send({ status: false, msg: "email is required" })
    }
    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      return res.status(400).send({ status: false, msg: "please enter a valid email" })
    }
    if (!password) {
      return res.status(400).send({ status: false, msg: "password is required" })
    }
    const validEmail = validator.isEmail(email)
    if (!validEmail) {
      return res.status(400).send({ status: false, msg: "email is not valid" })
    }

    const checkedUser = await userModels.findOne({ email: email, password: password });
    if (!checkedUser) {
      return res.status(404).send({ status: false, msg: "email or password is not correct" });
    }

    else {
      const token = jwt.sign({ userId: checkedUser._id.toString() }, "functionUp", { expiresIn: '1d' });
      res.header('x-auth-key', token)
      return res.status(201).send({ status: true, Token: token });
    }

  }
  catch (error) { res.status(500).send({ msg: error.message }) }
};






module.exports.userLogIn = userLogIn;
module.exports.registerUser = registerUser;





