var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
require("dotenv").config();
const sharp = require('sharp');

const cors = require('cors');
const fs = require('fs');

require("./config/database.js"); // Ensure this path is correct based on your project structure
const AuthController=require("./controllers/AuthController.js")
const usersRoutes = require('./Controllers/UsersController.js');
const userAccess=require("./Controllers/UserAccessController.js")
const department=require("./Controllers/DepartmentController.js")
const subdepartments=require("./Controllers/SubDepartmentController.js")
const document=require("./controllers/DocumentController.js")


var app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
// Allow all origins (for dev or open API)
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/static/public',express.static(path.join(__dirname, 'public/images')));
// app.use(express.static(path.join(__dirname, 'dist')));
// catch 404 and forward to error handler

// For single-page app routing


//routes
app.use("/auth",AuthController)
app.use('/users', usersRoutes);
app.use('/userAccess', userAccess); // Add your user access routes
app.use('/department', department);
app.use('/subdepartments', subdepartments);
app.use("/documents",document)



module.exports = app;
