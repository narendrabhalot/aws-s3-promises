const mongoose = require("mongoose")
const moment = require('moment')

 let date = moment().format('DD/MM/YYYY');
 console.log(date)



const userSchema = new mongoose.Schema(
    {
      title: {
        type: String,
        required: true,
        trim:true,
        enum: ["Mr", "Mrs", "Miss"],
      },

       name: {
        type: String,
        required: true,
        trim:true,
      },

      email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required:[true, 'Email address is required'],
        validate: {
          validator: function (email) {
              return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
          },
          message: "please enter a valid email"
      }
    },

    password: {
      type: String,
      required: true,
      unique:true,
      trim:true
    },

    address: {
      
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


      phone: {
        type : Number,
        required : [true, "phone number is mandatory"],
        unique: [true, "phone number already exist"],
        validator: function (phone) {
          return /^(\+\d{1,3}[- ]?)?\d{10}$/.test(phone);
      }
    },

    

 }, {timestamps: true });
  
  module.exports = mongoose.model("User", userSchema);
  
