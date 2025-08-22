const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/user.model");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, isAdmin: user.isAdmin},
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

const googleLogin = async (req, res) => {
  try {
    const { token, adminPassword } = req.body;

    if (!token) {
      return res.status(400).json({ success: false, message: "No token provided" });
    }

    // Verify token with Google
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    const { name, email, picture: profilePicture, sub: googleId } = payload;

    // Check admin credentials if admin password is provided
    let isAdmin = false;
    if (adminPassword) {
      if (adminPassword === process.env.ADMIN_PASSWORD) {
        isAdmin = true;
      } else {
        return res.status(401).json({ 
          success: false, 
          message: "Invalid admin password" 
        });
      }
    }

    // Check if user exists
    let isNewUser = false;
    let user = await UserModel.findOne({ email });

    if (!user) {
      isNewUser = true;
      user = new UserModel({
        name,
        email,
        profilePicture,
        googleId,
        isAdmin // Set admin status based on verification
      });
      await user.save();
    } else {
      // Update existing user's admin status if they provided correct admin password
      if (adminPassword && isAdmin) {
        user.isAdmin = true;
        await user.save();
      }
    }

    const appToken = generateToken(user);

    return res.status(isNewUser ? 201 : 200).json({
      success: true,
      token: appToken,
      message: isNewUser ? "Account created successfully" : "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profilePicture: user.profilePicture,
        isAdmin: user.isAdmin
      }
    });

  } catch (error) {
    console.error("Google login error:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: process.env.NODE_ENV === "development" ? error.message : undefined
    });
  }
};

module.exports = { googleLogin };