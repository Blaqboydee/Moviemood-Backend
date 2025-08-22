const express = require('express')
const foodrouter = express.Router()
const {Createfood, Fetchallfoods, DeleteFoodItem} = require("../controllers/foodanddrinks.controller")

foodrouter.post("/createfood", Createfood)
foodrouter.get("/fetchfoods", Fetchallfoods)
foodrouter.delete("/deletefood/:id", DeleteFoodItem)

module.exports = foodrouter