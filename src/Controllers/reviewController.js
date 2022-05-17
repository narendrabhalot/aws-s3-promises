
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

        let check = await bookModels.findOne({ _id: bookId, isDeleted: false })
        if (!check) {
            return res.status(404).send({ status: false, message: "No book found or deleted" })
        } else {
            let data = req.body
            let { review, rating } = data

            if (!isValid(data)) {
                return res.status(400).send({ status: false, msg: "please provide  details" })
            }

            if (!isValid(review)) {
                return res.status(400).send({ status: false, msg: "Not a valid review" })
            }
            if (!(rating >= 1 && rating <= 5)) {
                return res.status(400).send({ status: false, msg: "Rating should be inbetween 1-5 " })
            }

            data.reviewedAt = new Date()
            data.bookId = bookId
            let newReview = await bookModels.findOneAndUpdate({ _id: bookId }, {
                $inc: {
                    review: 1
                },
            }, { new: true, upsert: true })

            let savedData = await reviewModels.create(data)
            newReview._doc["reviewData"] = savedData
            return res.status(201).send({ status: true, data: newReview })
        }
    }
    catch (error) {
        console.log(error)
        res.status(500).send({ status: false, msg: "error", err: error.message })

    }
}


const updateReview = async function (req, res) {

    let bookId = req.params.bookId
    let reviewId = req.params.reviewId
    let body = req.body

    
    if (!isValidObjectId(bookId)) {
        return res.status(400).send({ status: false, msg: "invalid bookId" })
    }

    let checkBookId = await bookModels.findOne({_id:bookId})
    if (!checkBookId) {
        return res.status(404).send({ status: false, msg: "BookId not exist" })
    }
    let checkIsDeleted = checkBookId.isDeleted
    if (checkIsDeleted == true) {
        return res.status(400).send({ status: false, msg: "bookId is already Deleted" })
    }
    if (!isValidObjectId(reviewId)) {
        return res.status(400).send({ status: false, msg: "invalid review id" })
    }
    let checkReview = await reviewModels.findById(reviewId)
    if (!checkReview) {
        return res.status(404).send({ status: false, msg: "reviewId not exist" })
    }
    let isreviewDeleted = checkReview.isDeleted
    if(isreviewDeleted == true){
        return res.status(404).send({ status: false, msg: " review already deleted" })
    }

    let updateReview = await reviewModels.findOneAndUpdate({ _id: reviewId }, body, { new: true }).s

    
    checkBookId._doc["reviews Data"] = updateReview
    return res.status(200).send({ status: true, msg: "update successfully", data: checkBookId })


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
            return res.status(400).send({ status: false, msg: "bookId not valid, please provide valid bookId Id" });
        }

        const findDataByBookId = await bookModels.findOne({_id:bookId, isDeleted:false});
          console.log(findDataByBookId)
        if (!findDataByBookId) {
            return res.status(404).send({ status: false, msg: "Book not found" });
        }

        const findReview = await reviewModels.findById(reviewId);

        if (!findReview) {
            return res.status(404).send({ status: false, msg: "Review not found" });
        }

        if (findReview.isDeleted == true) {
            return res.status(400).send({ status: false, msg: "Review is already deleted" });
        }

        
            const reviewDeleted = await reviewModels.findOneAndUpdate({ _id: reviewId }, { $set: { isDeleted: true } }, { new: true });

            findDataByBookId.review = findDataByBookId.review === 0 ? 0 : findDataByBookId.review - 1
             await findDataByBookId.save()
            return res.status(200).send({ status: true, msg: "review deleted successfully" });
        

    } catch (error) {
        return res.status(500).send({ status: false, msg: error.message })

    }
}







module.exports.createReview = createReview
module.exports.deletedReviews = deletedReviews
module.exports.updateReview = updateReview
