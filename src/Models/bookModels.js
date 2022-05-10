 const mongoose = require("mongoose");
 let objectId = mongoose.Schema.Types.ObjectId;




// const bookSchema = new mongoose.Schema(
//     {
//       title: {
//         type: String,
//         required: true,
//         unique:true
//       },

//       excerpt: {
//         type: String,
//         required: true,
//       },

//       userId: {
//         type: objectId,
//         required: true,
//         ref: "User",
//       },
//       ISBN:{
//           type: String,
//           required:true,
//           unique:true
//       },
     
//       category: {
//         type: String,
//         required: true,
//       },

//       subcategory: {
//         type:String,
//         required:true,
//       },

//       review:{
//           type: Number,
//           default:0,
//           comment: "Holds number of reviews of this book",
//       },

//       deletedAt: {
//         type:Boolean,
//        default: false
//      },

//       isDeleted: {
//         type: Boolean,
//         default: false,
//       },

     

//       releasedAt: {
//         type: Date,
//         required:true,
//         formate: YYYY-MM-DD
//       },

//       createdAt: timestamp,
//        updatedAt: timestamp,
//     },

//     { timestamps: true }
//   );
  
//   module.exports = mongoose.model("Book", bookSchema);
  