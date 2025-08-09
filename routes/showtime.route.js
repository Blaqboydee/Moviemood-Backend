const express = require('express')
const showtimerouter = express.Router()
const {Fetchshowtimes} = require("../controllers/showtime.controller")

showtimerouter.get("/fetchshowtime", Fetchshowtimes);


module.exports = showtimerouter