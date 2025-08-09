const mongoose = require("mongoose");
const FoodItem = require("../models/foodanddrinks.model");
const cloudinary = require("../utils/cloudinary");

const Createfood = async (req, res) => {
  try {
    const { available, category, foodImage, name, price } = req.body;

    if (!available || !category || !foodImage || !name || !price) {
      return res.status(400).send({
        message: "All fields are mandatory",
        status: false,
      });
    }

    const uploadedImage = await cloudinary.uploader.upload(foodImage);

    if (!uploadedImage || !uploadedImage.secure_url) {
      return res.status(406).send({
        message: "Unable to upload image",
        status: false,
      });
    }

    const Createdfood = await FoodItem.create({
      available,
      category,
      foodImage: uploadedImage.secure_url, // fixed: secure_url not secure.url
      name,
      price,
    });

    if (!Createdfood) {
      return res.status(406).send({
        message: "Unable to upload Food Item",
        status: false,
      });
    }

    return res.status(200).send({
      message: "Food Item uploaded successfully",
      status: true,
    });

  } catch (error) {
    console.error("Error uploading Food Item:", error);
    return res.status(500).send({
      message: error.message || "Internal server error",
      status: false,
    });
  }
};

const Fetchallfoods = async (req, res) => {
  try {
    const allfoods = await FoodItem.find(); // ✅ Use await here
    console.log(allfoods); // Now logs real documents

    res.status(200).json({
      status: true,
      data: allfoods,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
};

module.exports = {Createfood, Fetchallfoods};
