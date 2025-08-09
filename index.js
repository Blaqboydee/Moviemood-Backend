const express = require("express")
const app = express()
require('dotenv').config()
const cors = require("cors")
const connect = require("./Db.config/dbconfig")
const movierouter = require("./routes/movie.route")
const showtimerouter = require("./routes/showtime.route")
const foodrouter = require("./routes/foodanddrinks.route")
const Bookingrouter = require("./routes/bookings.route")
const authrouter = require("./routes/auth.route")

const allowedOrigins = [
  "http://localhost:5173",               // Local Vite dev
  "https://moviemoodcinema.vercel.app"   // Production frontend
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true
  })
);
app.use(express.json({extended:true, limit:"50mb"}))
app.use("/movie", movierouter)
app.use("/showtime", showtimerouter)
app.use("/food", foodrouter)
app.use("/bookings", Bookingrouter)
app.use("/auth", authrouter)


connect()
const port = 6176;
app.listen(port, ()=>{
    console.log(`app started at ${port} `);
    
})