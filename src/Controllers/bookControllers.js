const mongoose = require("mongoose");
const userModels = require("../models/userModels.js");
const bookModels = require("../Models/bookModels.js");
const reviewModels = require("../Models/reviewModels.js");




const isValid = function (value) {
    if (typeof value === "undefined" || value === null) return false;
    if (typeof value === "string" && value.trim().length === 0) return false;
    return true;
};

const isValidObjectId = function (objectId) {
    return mongoose.Types.ObjectId.isValid(objectId)
}


const isValidRequestBody = function (requestbody) {
    return Object.keys(requestbody).length > 0;
}





const createBook = async function (req, res) {
    try {

        let data = req.body;
        let userId = data.userId
        if (!isValidObjectId(userId)) {
            return res.status(400).send({ status: false, msg: `${userId} invalid userId` })
        }
        let checkuser = await userModels.findById(userId)
        console.log(checkuser)

        if (!checkuser) {
            return res.status(404).send({ status: false, msg: "No user found this userId" })

        }

        if (userId != req.userId) {
            return res.status(401).send({ status: false, msg: "you can't create the book " })
        }

        if (!isValidRequestBody(data)) {
            return res.send({ status: false, msg: "please provide  details" })
        }
        else {
            const { title, excerpt, userId, ISBN, category, subcategory, isDeleted, releasedAt } = data

            if (isDeleted) {
                if (isDeleted == true) {
                    return res.status(400).send({ status: false, msg: "data is not valid" })
                }
            }

            if (!isValid(title)) {
                return res.status(400).send({ status: false, msg: "title is required" })
            }


            let uniqueTitle = await bookModels.findOne({ title: title })
            if (uniqueTitle) return res.status(400).send({ status: false, msg: " title already exists" })



            if (!isValid(excerpt)) {
                return res.status(400).send({ status: false, msg: "excerpt is required" })
            }

            if (!isValid(userId)) {
                return res.status(400).send({ status: false, msg: "userId is required" })
            }

            if (!isValidObjectId(userId)) {
                return res.status(400).send({ status: false, msg: "invalid userId" })
            }



            let isUser = await userModels.findById(userId)
            if (!isUser) {
                return res.status(404).send({ status: false, msg: "user is not exist" })
            }

            if (!isValid(ISBN)) {
                return res.status(400).send({ status: false, msg: "ISBN is required" })
            }
            let existISBN = await bookModels.findOne({ ISBN })
            console.log(existISBN)
            if (existISBN) {
                return res.status(404).send({ status: false, msg: "ISBN is already present" })
            }

            if (!isValid(category)) {
                return res.status(400).send({ status: false, msg: "category is required" })
            }


            if (!isValid(subcategory)) {
                return res.status(400).send({ status: false, msg: "subcategory is required" })
            }
            if (!isValid(releasedAt)) {
                return res.status(400).send({ status: false, msg: "releasedAt is required" })
            }



        }


        let saveData = await bookModels.create(data)
        return res.status(201).send({ status: true, msg: "book create successfuly", data: saveData })

    }
    catch (error) {
        console.log(error)
        return res.status(500).send({ status: false, msg: "error", error: error.message })

    }
}





const getBooks = async function (req, res) {
    try {
        const filterQuery = { isDeleted: false }
        const queryParams = req.query

        if (isValidRequestBody(queryParams)) {
            const { userId, category, subcategory } = queryParams
            if (!isValidObjectId(userId)) {
                return res.status(400).send({ status: false, msg: "invalid userId" })
            }
            if (isValid(userId)) {
                filterQuery['userId'] = userId
            }
            if (isValid(category)) {
                filterQuery['category'] = category.trim()
            }
            if (isValid(subcategory)) {
                filterQuery['subcategory'] = subcategory.trim()
            }
        }
        let allBooks = await bookModels.find(filterQuery).select({ ISBN: 0, subcategory: 0, deletedAt: 0, isDeleted: 0, createdAt: 0, updatedAt: 0, __v: 0 }).sort({ title: 1 })
        if (Array.isArray(allBooks) && allBooks.length === 0)
            res.status(404).send({ status: false, msg: "no books found" })


        return res.status(200).send({ status: true, msg: "Book List", data: allBooks })
    }
    catch (error) {
        res.status(500).send({ status: false, msg: error.message })
    }
}







const getBooksById = async function (req, res) {
    try {
        const bookId = req.params.bookId;
        if (!isValidObjectId(bookId)) {
            return res.status(400).send({ status: false, msg: "invalid bookId" })
        }
        if (Object.keys(bookId).length === 0) {
            return res.status(400).send({ status: false, message: "book id is not present" })
        }

       

        const foundedBook = await bookModels.findOne({_id:bookId}).select({ __v: 0 })
        console.log(foundedBook)

        if (!foundedBook) {
            return res.status(404).send({ status: false, message: "book not found" })
        }
        const availableReviews = await reviewModels.find({ bookId: foundedBook._id, isDeleted: false }).select({ isDeleted: 0, createdAt: 0, updateAt: 0, __v: 0 })

        foundedBook._doc["reviewData"] = availableReviews

        return res.status(200).send({ status: true, message: "Books list", data: foundedBook })


    } catch (error) { res.status(500).send({ msg: error.message }) }
}


const updateBooks = async function (req, res) {
    try {


        const requestBody = req.body;
        const params = req.params;
        const bookId = params.bookId;
        const userId = req.userId

        if (!isValidObjectId(bookId)) {
            return res.status(400).send({ status: false, msg: `${bookId} is not a invalid bookId` })
        }
        if (!isValidObjectId(userId)) {
            return res.status(400).send({ status: false, msg: `${userId} is not a invalid userId` })
        }

        const book = await bookModels.findOne({ _id: bookId, isDeleted: false })
        console.log(book)

        if (!book) {
            return res.status(404).send({ status: false, msg: "No book found this bookId" })

        }

        let bookIds = book.userId
        if (!bookIds) {
            return res.status(400).send({ status: false, msg: " book is not present" })
        }

        if (bookIds != req.userId) {
            return res.status(403).send({ status: false, msg: "you are not change the book " })
        }
        let usedtitle = await bookModels.findOne({ title: requestBody.title })
        if (usedtitle) {
            return res.status(400).send({ status: false, msg: "title alread used " })
        }
        if (book.isDeleted == true) {
            return res.status(400).send({ status: false, msg: " Book has deleted " })
        }
        if (!isValidRequestBody(requestBody)) {
            return res.send({ status: false, msg: "please provide  details in body" })
        }
        const { title, excerpt, releasedAt, ISBN } = requestBody
        const updateBookData = {}

        if (isValid(title)) {
            const isTitleAlreadyUsed = await bookModels.findOne({ title, _id: { $ne: bookId } })
            if (isTitleAlreadyUsed)
                return res.status(400).send({ status: false, msg: `${title} title is already used` })

            if (!Object.prototype.hasOwnProperty.call(updateBookData, `$set`))
                updateBookData['$set'] = {}
            updateBookData['$set']['title'] = title
        }

        if (isValid(excerpt)) {
            if (!Object.prototype.hasOwnProperty.call(updateBookData, `$set`))
                updateBookData['$set'] = {}
            updateBookData['$set']['excerpt'] = excerpt
        }
        if (isValid(ISBN)) {
            const isISBNAlreadyUsed = await bookModels.findOne({ ISBN, _id: { $ne: bookId } })
            if (isISBNAlreadyUsed)
                return res.status(400).send({ status: false, msg: `${ISBN} ISBN  already exist` })

            if (!Object.prototype.hasOwnProperty.call(updateBookData, `$set`))
                updateBookData['$set'] = {}
            updateBookData['$set']['ISBN'] = ISBN
        }
        if (isValid(releasedAt)) {
            if (!Object.prototype.hasOwnProperty.call(updateBookData, `$set`))
                updateBookData['$set'] = {}
            updateBookData['$set']['releasedAt'] = releasedAt
        }


        let updatebook = await bookModels.findOneAndUpdate({ _id: bookId }, updateBookData, { new: true })

        return res.status(200).send({ status: true, msg: "book update successfully ", data: updatebook })




    }
    catch (err) {
        res.status(500).send({ status: false, error: err.message })
    }

}



const deleteBooksById = async function (req, res) {

    try {
        let bookId = req.params.bookId

        if (!isValidObjectId(bookId)) {
            return res.status(400).send({ status: false, msg: "invalid bookId" })
        }
        let checkBook = await bookModels.findById(bookId)
        console.log(checkBook)

        if (!checkBook) {
            return res.status(404).send({ status: false, msg: "No book found this bookId" })

        }

        let bookIds = checkBook.userId
        if (!bookIds) {
            return res.status(404).send({ status: false, msg: " book is not present" })
        }

        if (bookIds != req.userId) {
            return res.status(403).send({ status: false, msg: "you are not change the book " })
        }


        let isDeleted = checkBook.isDeleted
        if (isDeleted == true) {
            return res.status(400).send({ status: false, msg: "book already deleted" })
        }
        let allBooks = await bookModels.findOneAndUpdate({ _id: bookId }, { $set: { isDeleted: true, deletedAt: Date.now() } }, { new: true, upsert: true })
        if (allBooks)
            return res.status(200).send({ status: true, data: "book deleted successfully" })
        else
            res.status(404).send({ status: false, msg: "No Books Exist" })
    }
    catch (err) {
        res.status(500).send({ status: false, msg: err.message })
    }
}

module.exports = {
    updateBooks,
    getBooksById,
    createBook,
    getBooks,
    deleteBooksById
}
