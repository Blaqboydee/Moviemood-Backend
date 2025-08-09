const mongoose = require("mongoose");

const seatSchema = new mongoose.Schema({
  number: Number,
  isBooked: { type: Boolean, default: false },
  bookedBy: { type: String, default: null },
});

const showtimeSchema = new mongoose.Schema({
  movieId: { type: mongoose.Schema.Types.ObjectId, ref: "Movie", required: true },
  date: { type: String, required: true }, // e.g., "2025-07-15"
  time: { type: String, required: true }, // e.g., "14:00"
  seats: [seatSchema],
});

const Showtime = mongoose.model("Showtime", showtimeSchema);

module.exports = Showtime;

