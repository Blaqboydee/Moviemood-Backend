const express = require('express')
const foodrouter = express.Router()
const {Createfood, Fetchallfoods} = require("../controllers/foodanddrinks.controller")

foodrouter.post("/createfood", Createfood)
foodrouter.get("/fetchfoods", Fetchallfoods)

module.exports = foodrouter