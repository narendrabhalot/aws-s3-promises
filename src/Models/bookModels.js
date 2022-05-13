const mongoose = require("mongoose");
let objectId = mongoose.Schema.Types.ObjectId;
const moment = require('moment')



const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },

    excerpt: {
      type: String,
      required: true,
      trim: true
    },

    userId: {
      type: objectId,
      required: true,
      ref: "User",
    },
    ISBN: {
      type: String,
      required: true,
      unique: true
    },

    category: {
      type: String,
      required: true,
    },

    subcategory: {
      type: String,
      required: true,
    },

    review: {
      type: Number,
      default: 0,
      comment: "Holds number of reviews of this book",
    },

    

    isDeleted: {
      type: Boolean,
      default: false,
    },


    releasedAt: {
      type: Date,
      required: true,
      default:moment().format('YYYY-MM-DD')

    },

  },

  { timestamps: true }
);

module.exports = mongoose.model("Book", bookSchema);
