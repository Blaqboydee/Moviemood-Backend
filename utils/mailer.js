const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Email template function
const createBookingEmail = (customerName, seats, totalPrice, bookingId, time, date, foodItems, title) => {
  // Calculate total food cost if each item has price
  let foodTotal = 0;
  if (foodItems && foodItems.length > 0) {
    foodTotal = foodItems.reduce((sum, item) => {
      const price = parseFloat(item.price) || 0; 
      return sum + (price * (item.quantity || 0));
    }, 0);
  }

  const ticketTotal = totalPrice - foodTotal;

  return `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; }
            .header { background: #2c3e50; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; }
            .booking-details { background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #2c3e50; color: white; }
            .total-row { font-weight: bold; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🎬 MovieMood Cinema</h1>
                <p>Booking Confirmation</p>
            </div>
            <div class="content">
                <h2>Hello ${customerName}!</h2>
                <p>Your movie booking has been confirmed. Get ready for an amazing experience!</p>
                
                <div class="booking-details">
                    <h3>Booking Details:</h3>
                    <p><strong>Movie Title:</strong> ${title}</p>
                    <p><strong>Seats:</strong> ${seats.join(', ')}</p>
                    <p><strong>Booking ID:</strong> ${bookingId}</p>
                    <p><strong>Date:</strong> ${date}</p>
                    <p><strong>Time:</strong> ${time}</p>

                    <h4>Payment Summary:</h4>
                    <table>
                        <tr>
                            <td>🎟 Ticket(s)</td>
                            <td>₦${ticketTotal.toLocaleString()}</td>
                        </tr>
                        ${foodItems && foodItems.length > 0 ? `
                          <tr>
                            <td>🍔 Food & Drinks</td>
                            <td>₦${foodTotal.toLocaleString()}</td>
                          </tr>
                        ` : ''}
                        <tr class="total-row">
                            <td>Total Paid</td>
                            <td>₦${totalPrice.toLocaleString()}</td>
                        </tr>
                    </table>

                    ${foodItems && foodItems.length > 0 ? `
                      <h4>Food Items:</h4>
                      <table>
                        <thead>
                          <tr>
                            <th>Item</th>
                            <th>Quantity</th>
                            <th>Price</th>
                            <th>Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          ${foodItems.map(item => `
                            <tr>
                              <td>${item.name}</td>
                              <td>${item.quantity}</td>
                              <td>₦${parseFloat(item.price || 0).toLocaleString()}</td>
                              <td>₦${(parseFloat(item.price || 0) * (item.quantity || 0)).toLocaleString()}</td>
                            </tr>
                          `).join('')}
                        </tbody>
                      </table>
                    ` : 'You no buy food, hunger go wan kee you'}
                </div>
                
                <p>Please arrive 15 minutes before showtime. Enjoy your movie!</p>
            </div>
        </div>
    </body>
    </html>
  `;
};



module.exports = { transporter, createBookingEmail };