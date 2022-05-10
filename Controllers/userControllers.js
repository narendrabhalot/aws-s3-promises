const jwt = require("jsonwebtoken");
const userModels = require("../models/userModels.js");

 const validator = require('validator');


const isValid = function (value) {
    if (typeof value === "undefined" || value === null) return false;
    if (typeof value === "string" && value.trim().length === 0) return false;
    return true;
  };

  ////////////////////----CREATING USER-----/////////////////////

const registerUser = async function (req , res){
    
        try {
            let data = req.body
            console.log(Object.keys(data))
            if (Object.keys(data).length == 0) {
                res.status(400).send({ status: false, msg: "data not found, Please give the data" })      
                
            }else {
    
                const {title, name, email, password,mobile, address } = data


                const checkTitle = data.title
                if (!checkTitle){
                 return res.status(400).send({status:false, msg:"Title required"})
               }
           
              if (checkTitle){
                if (checkTitle=="Mr" || checkTitle== "Mrs" || checkTitle=="Miss")

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
    
                if (!isValid(password)) {
                    return res.status(400).send({ status: false, msg: "password is required" })
                }


                if (!isValid(mobile)) {
                  return res.status(400).send({ status: false, msg: "mobile number is required" })
              }


              if (!/^(\+\d{1,3}[- ]?)?\d{10}$/.test(mobile)) {
                return res.status(400).send({ status: false, msg: "please enter a valid mobile number" })
               }


                if (!isValid(address)) {
                    return res.status(400).send({ status: false, msg: "address is required" })
                }



                let saveData = await userModels.create(data)
                return res.status(201).send({ status: true, msg: saveData })
    
            }
    
        }
    }catch (error) {
            console.log(error)
            return res.status(500).send({ status: false, msg: "error", error: error.message })
    
        }
    }
    

//////////////////////////////////--USER LOGIN---///////////////////////////// 



const userLogIn = async function (req, res) {
  
    try{
      const email = req.body.email;
      const password = req.body.password;
    
      if (!password){
         return res.status(400).send({status:false, msg:"password is required"})
      }
    
      if (!email){
        return res.status(400).send({status:false, msg:"email is required"})



      }
    ///////////////////////// -VALIDATOR- ///////////////////////////////////////


     const validEmail = validator.isEmail(email)
     if (!validEmail){
       return res.status(400).send({status:false, msg:"email is not valid"})
     }

    
     const checkedUser = await userModels.findOne({ email: email, password: password });
      if (!checkedUser) {
        return res.status(404).send({ status: false, msg: "email or password is not correct"});
      }

       else {
        const token = jwt.sign({ userId: checkedUser._id.toString() },"functionUp");
        return res.status(201).send({ status: true, Token: token });
      }

    }
    catch (error) { res.status(500).send({ msg: error.message })}};





    
    module.exports.userLogIn = userLogIn;
    module.exports.registerUser = registerUser;





