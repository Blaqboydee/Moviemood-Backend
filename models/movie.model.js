const mongoose = require("mongoose");



const movieSchema = new mongoose.Schema(
  {
    title: { type: String, trim: true, required: true },
    language: { type: String, trim: true, required: true },
    releasedate: { type: String, trim: true, required: true },
    duration: { type: String, trim: true, required: true },
    genre: { type: [String], required: true },
    description: { type: String, trim: true, required: true },
    price: { type: String, trim: true, required: true },
    trailer: { type: String, trim: true, required: true },
    movieImage: { type: String, trim: true, required: true },
    movieBackdrop: { type: String, trim: true, required: true },
    status: { type: String, trim: true, required: true },
    movieSlug: { type: String, trim: true, required: true },

    cast: [
      {
        name: { type: String, trim: true, required: true },
        image: { type: String, trim: true, required: true },
      },
    ],
  },
  { timestamps: true }
);





const moviemodel = mongoose.model("movies", movieSchema);

module.exports = moviemodel;


