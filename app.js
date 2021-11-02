require("dotenv").config({path: './.env.local'});
require("./config/database").connect();
const cors = require('cors');

const express = require("express");

const app = express();

//app.use(express.json());
app.use(express.json({extended: true}))
app.use(express.urlencoded({extended: true}))
app.use(cors())

// Logic goes here

module.exports = app;