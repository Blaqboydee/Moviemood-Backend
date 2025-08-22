const BookingModel = require("../models/booking.model");
const Showtime = require("../models/showtime.model"); 
const { transporter, createBookingEmail } = require("../utils/mailer");

const Bookseats = async (req, res) => {
  try {
    const { userEmail, showtimeId, seats, totalPrice, seatsTosend, time, date, FoodDrinks, movieTitle } = req.body;


    

    // Find the showtime
    const showtime = await Showtime.findById(showtimeId);
    if (!showtime) return res.status(404).send("Showtime not found");

    // Convert seat numbers to integers
    const seatNumbers = seats.map(seat => parseInt(seat));

    // Check if any selected seat is already booked
    const alreadyBooked = showtime.seats.filter(seat =>
      seatNumbers.includes(seat.number) && seat.isBooked
    );
    if (alreadyBooked.length > 0) {
      return res.status(400).json({ message: "Some seats already booked" });
    }

    // Mark seats as booked
    showtime.seats.forEach(seat => {
      if (seatNumbers.includes(seat.number)) {
        seat.isBooked = true;
      }
    });

    await showtime.save();

    try {
      // Save booking record
      const newBooking = new BookingModel({
        userEmail,
        showtimeId,
        seats: seatNumbers,
        alphanumericSeats:seatsTosend,
        totalPrice,
        foodanddrinks:FoodDrinks,
        title: movieTitle,
      });

      const savedBooking = await newBooking.save();

      // Create and send confirmation email
      const emailHTML = createBookingEmail("Customer", seatsTosend, totalPrice, savedBooking._id, time, date, FoodDrinks, movieTitle);

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: userEmail,
        subject: 'Cinema Booking Confirmation',
        html: emailHTML
      };

      await transporter.sendMail(mailOptions);

      res.status(201).json({
        success: true,
        message: "Seats booked, booking saved, and email sent",
        data: savedBooking
      });

    } catch (innerError) {
      // ROLLBACK — mark seats as unbooked if booking/email fails
      showtime.seats.forEach(seat => {
        if (seatNumbers.includes(seat.number)) {
          seat.isBooked = false;
        }
      });
      await showtime.save();

      throw innerError;
    }

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};




// Get user bookings
const getUserBookings = async (req, res) => {
  try {
    const { userEmail } = req.params;

    
    if (!userEmail) {
      return res.status(400).json({
        success: false,
        message: "User email is required"
      });
    }

    const bookings = await BookingModel.find({ userEmail })
      .populate('showtimeId')
      .sort({ bookedAt: -1 });
   
    res.status(200).json({
      success: true,
      message: "Bookings retrieved successfully",
      data: bookings
    });

  } catch (error) {
    console.error("Get bookings error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

// Get booking by ID
const getBookingById = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const booking = await BookingModel.findById(bookingId)
      .populate('showtimeId');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Booking retrieved successfully",
      data: booking
    });

  } catch (error) {
    console.error("Get booking error:", error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: "Invalid booking ID format"
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

// Cancel booking
const cancelBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { userEmail } = req.body;

    const booking = await BookingModel.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found"
      });
    }

    // Verify the booking belongs to the user
    if (booking.userEmail !== userEmail) {
      return res.status(403).json({
        success: false,
        message: "You can only cancel your own bookings"
      });
    }

    if (booking.bookingStatus === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: "Booking is already cancelled"
      });
    }

    // Update booking status
    booking.bookingStatus = 'cancelled';
    await booking.save();

    res.status(200).json({
      success: true,
      message: "Booking cancelled successfully",
      data: {
        bookingId: booking._id,
        bookingStatus: booking.bookingStatus
      }
    });

  } catch (error) {
    console.error("Cancel booking error:", error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: "Invalid booking ID format"
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

// Get available seats for a showtime
const getAvailableSeats = async (req, res) => {
  try {
    const { showtimeId } = req.params;

    // Get all booked seats for this showtime (excluding cancelled bookings)
    const bookedBookings = await BookingModel.find({
      showtimeId: showtimeId,
      bookingStatus: { $ne: 'cancelled' }
    }).select('seats');

    const bookedSeats = bookedBookings.flatMap(booking => booking.seats);

    // You might want to get total available seats from your venue/screen model
    // For now, I'll assume a standard cinema layout
    const allSeats = [];
    const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    const seatsPerRow = 12;

    rows.forEach(row => {
      for (let i = 1; i <= seatsPerRow; i++) {
        allSeats.push(`${row}${i}`);
      }
    });

    const availableSeats = allSeats.filter(seat => !bookedSeats.includes(seat));

    res.status(200).json({
      success: true,
      message: "Available seats retrieved successfully",
      data: {
        availableSeats: availableSeats,
        bookedSeats: bookedSeats,
        totalAvailable: availableSeats.length,
        totalBooked: bookedSeats.length
      }
    });

  } catch (error) {
    console.error("Get available seats error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

module.exports = {
  Bookseats,
  getUserBookings,
  getBookingById,
  cancelBooking,
  getAvailableSeats
};