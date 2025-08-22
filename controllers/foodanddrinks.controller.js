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
    const allfoods = await FoodItem.find(); 

    res.status(200).json({
      status: true,
      data: allfoods,
    });
  } catch (error) {
 
    res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
};




const DeleteFoodItem = async (req, res) => {
  try {
    const { id } = req.params; // Get the food ID from URL parameters

    // Check if the food item exists
    const foodItem = await FoodItem.findById(id);
    
    if (!foodItem) {
      return res.status(404).json({
        status: false,
        message: "Food item not found",
      });
    }

    // Delete the food item
    await FoodItem.findByIdAndDelete(id);

    res.status(200).json({
      status: true,
      message: "Food item deleted successfully",
      data: {
        deletedId: id,
        deletedItem: foodItem.name || "Food item" 
      }
    });
  } catch (error) {
 
    
    // Handle invalid ObjectId format
    if (error.name === 'CastError') {
      return res.status(400).json({
        status: false,
        message: "Invalid food item ID format",
      });
    }

    res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
};






module.exports = {Createfood, Fetchallfoods, DeleteFoodItem};
