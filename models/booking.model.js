const mongoose = require("mongoose")

const bookingSchema = new mongoose.Schema({
  userEmail: { type: String, required: true },
  showtimeId: { type: mongoose.Schema.Types.ObjectId, ref: "Showtime", required: true },
  seats: [String], 
  alphanumericSeats:[String],
  totalPrice: { type: Number, required: true },
  bookingStatus: { 
    type: String, 
    enum: ['confirmed', 'cancelled', 'pending'], 
    default: 'confirmed' 
  },
  foodanddrinks:[Object],
  paymentId: { type: String }, // For payment tracking,
  title:{type: String, required: true},
  bookedAt: { type: Date, default: Date.now },
});

const BookingModel = mongoose.model("Booking", bookingSchema);

module.exports = BookingModel;