const userModels = require("../models/userModels.js");
const bookModels = require("../Models/bookModels.js");
const moment  = require('moment')





const isValid = function (value) {
    if (typeof value === "undefined" || value === null) return false;
    if (typeof value === "string" && value.trim().length === 0) return false;
    return true;
  };

  const isValidNumber = function(Number){
      if(typeof Number == NaN || Number === 0)return false;
      return true
  }

  const isvalidRequestBody = function (requestbody) {
    return Object.keys(requestbody).length > 0;
}


const createBook = async function(req, res){
    try{

        let data= req.body;

        if (!isvalidRequestBody(data)) {
            return res.send({ status: false, msg: "please provide  details" })
        }
       else{
            const {title, excerpt, userId ,ISBN, category, subcategory,review, isDeleted} = data

            if(isDeleted){
                if(isDeleted == true){
                    return res.status(400).send({status: false, msg: "data is not valid"})
                }
            }

            if (!isValid(title)) {
                return res.status(400).send({ status: false, msg: "title is required" })
            }


            let uniqueTitle = await bookModels.findOne({title: title})
            if(uniqueTitle) return res.status(409).send({status :false , msg : " title already exists"})



            if (!isValid(excerpt)) {
                return res.status(400).send({ status: false, msg: "excerpt is required" })
            }

            if (!isValid(userId)) {
                return res.status(400).send({ status: false, msg: "userId is required" })
            }

            if (!isValid(ISBN)) {
                return res.status(400).send({ status: false, msg: "ISBN is required" })
            }

            if (!isValid(category)) {
                return res.status(400).send({ status: false, msg: "category is required" })
            }


            if (!isValid(subcategory)) {
                return res.status(400).send({ status: false, msg: "subcategory is required" })
            }  

            if (!isValidNumber(review)) {
                return res.status(400).send({ status: false, msg: "number is required" })
            } 
           
           
        }

        req.body.releasedAt = moment().format('YYYY-MM-DD')
        let saveData = await bookModels.create(data)
        return res.status(201).send({ status: true, msg: saveData })

    }
    catch (error) {
        console.log(error)
        return res.status(500).send({ status: false, msg: "error", error: error.message })

    }
}



const getBooks = async function(req, res){
    try {
        let data = req.query;

        let Bookdata = await bookModels.find({isDeleted:false })
        if(!Bookdata) return res.status(404).send({status: false, msg : "No such Data"})
        if(Bookdata.length == 0){
            return res.status(404).send({status: false,msg : "No books are present"})
        }
        res.status(200).send({ status: true, msg: data })
    }
    catch (err) {
        res.status(500).send({ status: false, msg: err.message })
    }
}











module.exports.createBook = createBook