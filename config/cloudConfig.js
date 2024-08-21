const cloudinary = require("cloudinary").v2;
require('dotenv').config();

/*This is clodinary configuration*/
cloudinary.config({
    cloud_name : process.env.CLOUD_NAME,
    api_key : process.env.API_KEY,
    api_secret : process.env.API_SECRET,
    timeout: 600000
});

module.exports = cloudinary;