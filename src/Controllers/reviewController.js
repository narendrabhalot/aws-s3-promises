
const mongoose = require("mongoose");
const bookModels = require("../Models/bookModels.js");
const reviewModels = require("../Models/reviewModels.js");


const isValid = function (value) {
    if (typeof value === "undefined" || value === null) return false;
    if (typeof value === "string" && value.trim().length === 0) return false;
    return true;
};

const isValidObjectId = function (ObjectId) {
    return mongoose.Types.ObjectId.isValid(ObjectId)
}




const createReview = async function (req, res) {
    try {
        let bookId = req.params.bookId

        if (!bookId)
            return res.status(400).send({ status: false, msg: "Bad Request, please provide BookId in params" })

        let check = await bookModels.findById({ _id: bookId, isDeleted: false })
        if (!check) {
            return res.status(404).send({ status: false, message: "No book found" })
        } else {
            let data = req.body
            let { review, rating, reviewedBy } = data

            if (!isValid(data)) {
                return res.status(400).send({ status: false, msg: "please provide  details" })
            }

            if (!isValid(review)) {
                return res.status(400).send({ status: false, msg: "Not a valid review" })
            }

            if (!isValid(reviewedBy)) {
                return res.status(400).send({ status: false, msg: "Name should be a valid String " })
            }

            if (!(rating >= 1 && rating <= 5)) {
                return res.status(400).send({ status: false, msg: "Rating should be inbetween 1-5 " })
            }

            data.reviewedAt = new Date()
            data.bookId = bookId
            let newReview = await bookModels.findOneAndUpdate({ _id: bookId }, {
                $inc: {
                    review: 1
                }
            }, { new: true, upsert: true, })

            let savedData = await reviewModels.create(data)
            newReview._doc["reviewData"] = savedData
            return res.status(201).send({ status: true, data: newReview })
        }
    }
    catch (err) {
        console.log(err)
        res.status(500).send({ status: false, msg: "error", err: err.message })

    }
}


const updateReview = async function(req, res){

    let bookId =req.params.bookId
    let reviewId = req.params.reviewId
    let body = req.body

    let checkBookId = await bookModels.findById(bookId)
    if(!checkBookId){
        return res.status(400).send({status:false, msg:"BookId not exist"})
    }
    let checkIsDeleted = checkBookId.isDeleted
    if(checkIsDeleted == true){
        return res.status(400).send({status:false, msg:"bookId is already Deleted"})
    }
   let checkReview = await reviewModels.findById(reviewId) 
   if(!checkReview){
       return res.status(400).send({status:false , msg:"reviewId not exist"})
   }

   let updateReview = await reviewModels.findOneAndUpdate({_id:reviewId},body ,{new:true})

   let getReview = await reviewModels.find({bookId})
      checkBookId._doc["reviews Data"] = getReview
      return res.status(200).send({status : true , msg: "update successfully" , data:checkBookId })

   



}




const deletedReviews = async function (req, res) {
    try {

        const reviewId = req.params.reviewId;
        const bookId = req.params.bookId;

        if (!isValid(reviewId)) {
            return res.status(400).send({ status: false, msg: "Review Id required.." });
        }

        if (!isValidObjectId(reviewId)) {
            return res.status(400).send({ status: false, msg: "Review Id is not valid, please provide valid review Id" });
        }

        if (!isValid(bookId)) {
            return res.status(400).send({ status: false, msg: "Book Id required.." });
        }

        if (!isValidObjectId(bookId)) {
            return res.status(400).send({ status: false, msg: "Review Id is not valid, please provide valid review Id" });
        }

        const findDataByBookId = await bookModels.findById(bookId);

        if (!findDataByBookId) {
            return res.status(400).send({ status: false, msg: "Book not found" });
        }

        const findReview = await reviewModels.findById(reviewId);

        if (!findReview) {
            return res.status(400).send({ status: false, msg: "Review not found" });
        }

        if (findReview.isDeleted == true) {
            return res.status(400).send({ status: false, msg: "Review is already deleted" });
        }

        else {
            const reviewDeleted = await reviewModels.findOneAndUpdate({ _id:reviewId }, { $set: { isDeleted: true } }, { new: true });

            const reviewRemoved = await bookModels.findByIdAndUpdate({ _id:bookId }, { $inc: { review: -1 } });

            return res.status(200).send({ status: true, msg: "review deleted successfully" });
        }

    } catch (error) {
        return res.status(500).send({ status: false, msg: error.message })

    }
}







module.exports.createReview = createReview
module.exports.deletedReviews = deletedReviews
module.exports.updateReview= updateReview
