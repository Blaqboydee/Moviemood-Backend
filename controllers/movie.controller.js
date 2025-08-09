const mongoose = require("mongoose");
const moviemodel = require("../models/movie.model");
const Showtime = require("../models/showtime.model")
const cloudinary = require("../utils/cloudinary");
const slugify = require("slugify");


const Createmovie = async (req, res) => {
  try {
    const { title, genre, price, trailer, movieImage, movieBackdrop, description, language, cast, releasedate, duration, status} = req.body;

    if (!title || !genre || !price || !trailer || !movieImage || !movieBackdrop || !description || !language || !cast || !releasedate || !duration || !status) {
      return res
        .status(400)
        .send({ message: "All fields are mandatory", status: false });
    }

    const imageurl = await cloudinary.uploader.upload(movieImage);
    console.log("Image URL:", imageurl.secure_url);

    const backdropurl = await cloudinary.uploader.upload(movieBackdrop);
    console.log("Image URL:", backdropurl.secure_url);

    if (!imageurl || !imageurl.secure_url) {
      return res
        .status(406)
        .send({ message: "Unable to upload image", status: false });
    }

       if (!backdropurl || !backdropurl.secure_url) {
      return res
        .status(406)
        .send({ message: "Unable to upload backdrop", status: false });
    }

    const slug = slugify(title, {
      replacement: "-",
      lower: true,
      strict: false,
      trim: true,
    });


    console.log("Slug:", slug);

  const createdmovie = await moviemodel.create({
  title,
  genre,
  price,
  trailer,
  movieImage: imageurl.secure_url,
  movieBackdrop: backdropurl.secure_url,
  movieSlug: slug,
  description,
  language,
  cast,
  releasedate,
  duration,
  status
});


    if (!createdmovie) {
      return res
        .status(406)
        .send({ message: "Unable to upload movie", status: false });
    }

    return res
      .status(200)
      .send({ message: "Movie uploaded successfully", status: true });
  } catch (error) {
    console.error("Error uploading movie:", error);
    return res
      .status(500)
      .send({ message: error.message || "Internal server error", status: false });
  }
};

const CreateShowtime = async (req, res) => {
  const { movieId, date, time } = req.body;

  const existing = await Showtime.findOne({ movieId, date, time });
  if (existing) {
    return res.status(400).json({ message: "Showtime already exists." });
  }

  const seats = Array.from({ length: 200 }, (_, i) => ({
    number: i + 1,
    isBooked: false,
  }));

  const newShowtime = new Showtime({ movieId, date, time, seats });
  await newShowtime.save();

  res.status(201).json({ message: "Showtime created!", showtime: newShowtime });
}

const Getmovie = async (req, res) => {
  try {
    const { _id } = req.body;
    const theMovie = await moviemodel.findOne({ _id });

    if (!theMovie) {
      return res.status(404).send({ message: "Movie not found", status: false });
    }
     console.log(theMovie);
     
    return res.status(200).send({
      message: "Movie fetched successfully",
      status: true,
      data: theMovie, // ✅ Send the movie data
    });
  } catch (error) {
    console.error("Error getting movie:", error);
    return res.status(500).send({
      message: error.message || "Internal server error",
      status: false,
    });
  }
};




module.exports = { Createmovie, CreateShowtime, Getmovie};
