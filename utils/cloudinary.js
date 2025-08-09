const cloudinary = require("cloudinary").v2

cloudinary.config({
        cloud_name: process.env.CLOUD_NAME, 
        api_key: process.env.CLOUD_API, 
        api_secret: process.env.CLOUD_SECRETKEY // Click 'View API Keys' above to copy your API secret
    });
    

module.exports = cloudinary
