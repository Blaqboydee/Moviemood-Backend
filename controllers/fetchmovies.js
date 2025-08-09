const moviemodel = require("../models/movie.model");

const fetchallmovies = async (req, res) => {
  try {
    const allmovies = await moviemodel.find(); // ✅ Use await here
    // console.log(allmovies); // Now logs real documents

    res.status(200).json({
      status: true,
      data: allmovies,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
};

module.exports = fetchallmovies;
