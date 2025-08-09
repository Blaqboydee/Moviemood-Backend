// scripts/fixCastImages.js

const mongoose = require("mongoose");
require("dotenv").config();
const moviemodel = require("../models/movie.model");
const cloudinary = require("../utils/cloudinary");

const connect = require("../Db.config/dbconfig")




connect().then(() => fixCastImages());



async function fixCastImages() {
  const movies = await moviemodel.find();

  for (let movie of movies) {
    let updatedCast = [];

    for (let castMember of movie.cast) {
      if (castMember.image.startsWith("data:image")) {
        const uploadRes = await cloudinary.uploader.upload(castMember.image, {
          folder: "cast_images",
        });

        updatedCast.push({
          name: castMember.name,
          image: uploadRes.secure_url,
        });
      } else {
        updatedCast.push(castMember); // Already a valid image URL
      }
    }

    movie.cast = updatedCast;
    await movie.save();
    console.log(`✔️ Updated cast images for: ${movie.title}`);
  }

  console.log("✅ All cast images updated.");
  mongoose.disconnect();
}

fixCastImages();
