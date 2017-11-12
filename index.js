// 'use strict';
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');
// const request = require('request');
// const multer = require('multer');
//const nodemailer = require('nodemailer');
const config = require('./config/database');


//Database Connection
mongoose.connect(config.database, {
    useMongoClient: true,
});
mongoose.connection.on('connected', function(){
    console.log("Connected To Database: "+config.database);
});
mongoose.connection.error('error', function(err){
    //console.log("Failed To Connect To Database: "+err);
});

//Initialize App
const app = express();
const PORT = "4000";

const seller = require("./route/sellerRoute");
// const users = require("./routes/userRoute");
// const category = require("./routes/categoryRoute");
// const subCategory = require("./routes/subCategoryRoute");
// const product = require("./routes/productRoute");


//Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());

// require('./config/passport')(passport);

// app.use('/user', users);
// app.use('/category', category);
// app.use('/subCategory', subCategory);
app.use('/seller', seller);
// app.use('/product', product);


//Static Folder to Use
app.use(express.static(__dirname + "/seller"));





//Index Routing
app.get('/', function(req, res) {
    res.send("Invalid END-Point");
});
app.get('/robots.txt', function (req, res) {
    res.type('text/plain');
    res.send("User-agent: *\nDisallow: ");
});
app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, 'seller/index.html'));
});

//Starting Server
app.listen(PORT, function(){
    console.log("Server Started on PORT: "+PORT);
});