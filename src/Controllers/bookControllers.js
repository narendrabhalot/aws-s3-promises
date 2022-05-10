// const userModel = require('../Models/userModels');
const bookModel = require('../Models/bookModels');

const updateBooks = async function(req ,res){
    try {

// let bookId = req.params.bookid;
// let checkBook = await bookModel.findById(bookId)
let bookId = req.params.bookId;
let checkBook = await bookModel.findById(bookId)
console.log(checkBook)
if(!checkBook){
    return res.status(404).send({status:false,msg:"No book found this bookId"})
}




    }
    catch(err){
        res.status(500).send({status:false,error:err.message})
    }

}
module.exports.updateBooks=updateBooks