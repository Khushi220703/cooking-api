
/*------------------------------------------This file have routes handling requets for uploading, displaying and searching receipes.------------------------------------------------- */
const express = require("express");
const router = express.Router();
const ReceipeModel = require("../models/receipeModel");
const cloudinary = require("../config/cloudConfig");
const multer = require("multer");
const stream = require('stream');

// Set up multer for file storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

/*---------------------------------------------------------------This route handle requests for uploading receipes in db-------------------------------------------------------------- */
router.post("/recipes", upload.fields([{ name: 'image', maxCount: 1 }, { name: 'video', maxCount: 1 }]), async (req, res) => {
  const { name, prepTime, ingredients, instructions, mealType,category, cuisine } = req.body;
  const imageFile = req.files['image'] ? req.files['image'][0] : null; // getting image of recipe.
  const videoFile = req.files['video'] ? req.files['video'][0] : null; // getting video of recipe.

  try {
    let imageUrl = '';
    let videoUrl = '';
  
    // Upload image to Cloudinary if provided
    if (imageFile) {
      imageUrl = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { resource_type: 'image' },
          (error, result) => {
            if (error) return reject(new Error(`Image upload error: ${error.message}`));
            resolve(result.secure_url);
          }
        );
        const bufferStream = new stream.PassThrough();
        bufferStream.end(imageFile.buffer);
        bufferStream.pipe(uploadStream);
      });
    }

    // Upload video to Cloudinary if provided
    if (videoFile) {
      videoUrl = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { resource_type: 'video' },
          (error, result) => {
            if (error) return reject(new Error(`Video upload error: ${error.message}`));
            resolve(result.secure_url);
          }
        );
        const bufferStream = new stream.PassThrough();
        bufferStream.end(videoFile.buffer);
        bufferStream.pipe(uploadStream);
      });
    }

    // Create a new instance of the recipe model
    const model = new ReceipeModel({ 
      name, 
      prepTime, 
      ingredients, 
      instructions, 
      mealType, 
      image: imageUrl, 
      cuisine,
      category,
      video: videoUrl
    });

    // Save the recipe to the database
    await model.save();
    console.log(model);

    // Send a success response
    res.status(201).send("Success");
  } catch (error) {
    // Send an error response
    console.log(error);
    res.status(500).send(error.message);
  }
});

/*----------------------------------------------This route handle requests for displaying all the receipes*-----------------------------------------------------------------------*/
router.get("/receipe", async(req,res)=>{
  try {
    
    
     const data = await ReceipeModel.find({});
     console.log(data);
     res.send(data);
     
  } catch (error) {
    res.send(error);
  }
})

/*-----------------------------------------------------This route handle requets for seraching the receipe--------------------------------------------------------------------------*/
router.get("/search/:id", async (req, res) => {
  const id = req.params; // Retrieve ID from URL parameters
  const cleanedId = id.id.replace(":", "");
  
  
  try {
    const data = await ReceipeModel.findById(cleanedId); // Find recipe by ID
    console.log(data);
    
    if (!data) {
      return res.status(404).send({ message: "Recipe not found" });
    }
    res.send(data);
  } catch (error) {
    res.status(500).send({ error: "Server error" });
  }
});
module.exports = router;
