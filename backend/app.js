const bodyParser = require('body-parser');
const express = require('express');
//const usersModel = require('./models/usersModel');
require('./models/dbconfig');
const path = require('path');


const app = express();
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
const AuthRouter = require("./routes/auth");
const SaucesRouter = require("./routes/sauces")

app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  }); 
app.use("/images", express.static(path.join(__dirname, 'images')));
app.use("/api/auth", AuthRouter);
app.use("/api/sauces", SaucesRouter);





module.exports = app;