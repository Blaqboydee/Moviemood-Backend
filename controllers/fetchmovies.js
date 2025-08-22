const moviemodel = require("../models/movie.model");

const fetchallmovies = async (req, res) => {
  try {
    const allmovies = await moviemodel.find(); // ✅ Use await here
   

    res.status(200).json({
      status: true,
      data: allmovies,
    });
  } catch (error) {

    res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
};

module.exports = fetchallmovies;
