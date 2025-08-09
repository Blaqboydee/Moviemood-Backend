const express = require('express')
const movierouter = express.Router()
const {Createmovie, CreateShowtime, Getmovie} = require("../controllers/movie.controller")
const fetchallmovies = require("../controllers/fetchmovies")


movierouter.post("/upload", Createmovie)
movierouter.post("/showtime", CreateShowtime)
movierouter.get("/fetch", fetchallmovies)
movierouter.post("/getmovie", Getmovie)

module.exports = movierouter