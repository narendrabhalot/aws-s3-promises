const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const route = require("./Router/routes")
const mongoose = require('mongoose')
const multer = require('multer')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(multer().any())
mongoose
  .connect(
    "mongodb+srv://pranali9897:fVYIUSUqjGOpc3Ts@pranali.boijp.mongodb.net/group42Database",
    {
      useNewUrlParser: true,
    }
  )
  .then(() =>
    console.log("MongoDb is connected")
  )
  .catch((err) => console.log(err));

  app.use("/", route);

  app.listen(process.env.PORT || 5000, function () {
    console.log("Express app running on port " + (process.env.PORT || 5000));
  });


