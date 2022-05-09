const mongoose = require("mongoose")
// let date = moment().format('DD/MM/YYYY');
// console.log(date)

const emailValidation = function(email){
    let regexForEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    return regexForEmail.test(email)
}

const mobileValidation = function(mobile){
    let regexForMobile = /^[6-9]\d{9}$/
    return regexForMobile.test(mobile)
}

const userSchema = new mongoose.Schema(
    {
      title: {
        type: String,
        required: true,
        enum: ["Mr", "Mrs", "Miss"],
      },

       name: {
        type: String,
        required: true,
      },

      email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: 'Email address is required',
        validate: [emailValidation, 'Please fill a valid email address'],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
     mobile: {
        type : Number,
        required : [true, "mobile number is mandatory"],
        unique: [true, "mobile number already exist"],
        validate:[mobileValidation, "please enter a valid mobile number"],
        trim :true
    },

      password: {
        type: String,
        required: true,
        unique:true
      },

      address: {
        type: String,},
        street: {
          type:String,
        },
        city: {
          type:String,
        },
        pincode: {
          type:Number
        }
      },

      // createdAt: timestamp,
      //  updatedAt: timestamp



    {timestamps: true }

  );
  
  module.exports = mongoose.model("User", userSchema);
  
