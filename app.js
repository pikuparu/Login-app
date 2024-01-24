//jshint esversion:6
require('dotenv').config()

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");
const app = express();
console.log(process.env.API_KEY);
app.use(express.static("public"));
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({
    extended:true
}));

mongoose.connect('mongodb://127.0.0.1:27017/userDB', { useNewUrlParser: true, useUnifiedTopology: true });

const userSchema = new mongoose.Schema ({
   email:String,
   password:String
});


userSchema.plugin(encrypt,{secret: process.env.SECRET,encryptedFields: ['password']});

const User = new mongoose.model('User', userSchema);
app.get("/",function(req,res){
   res.render("home");
});

app.get("/login",function(req,res){
   res.render("login");
});

app.get("/register",function(req,res){
   res.render("register");
});
 app.post("/register",function(req,res){
  const newUser = new User({
   email:req.body.username,
   password:req.body.password

});
  newUser.save()
      .then(() => {
         res.render("secrets");
      })
      .catch((err) => {
         console.log(err);
         res.status(500).send("Error saving user to database.");
      });
});
app.post("/login", async function(req, res) {
  const username = req.body.username;
  const password = req.body.password;

  try {
    // Use await to wait for the result of the findOne query
    const foundUser = await User.findOne({ email: username }).exec();

    // Check if a user was found
    if (foundUser) {
      // Check if the provided password matches the stored password
      if (foundUser.password === password) {
        // Passwords match, render the "secrets" page
        res.render("secrets");
      } else {
        // Passwords do not match
        console.log("Incorrect password");
        // Handle the case where the password is incorrect
        // For example, you might render an error page or redirect to the login page
      }
    } else {
      // User with the provided email not found
      console.log("User not found");
      // Handle the case where the user is not found
      // For example, you might render an error page or redirect to the login page
    }
  } catch (err) {
    // Handle any errors that occurred during the database query
    console.log(err);
    // For example, you might render an error page or redirect to the login page
  }
});


app.listen(3000,function(){
console.log("Server started on port 3000.");
});