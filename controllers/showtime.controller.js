const mongoose = require("mongoose");
const Showtime = require("../models/showtime.model")

const Fetchshowtimes = async(req, res) => {
  try {
    const allshowtimes = await Showtime.find(); // ✅ Use await here
    // console.log(allshowtimes); // Now logs real documents

    res.status(200).json({
      status: true,
      data: allshowtimes,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
}




module.exports = {Fetchshowtimes}