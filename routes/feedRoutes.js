const express = require("express");
const router = express.Router();
const Model = require("../models/feedModel");
const cloudinary = require("../config/cloudConfig");
const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage });

/*---------------------------------------------------------------This route handle request for uploading the reel video------------------------------------------------------------*/
router.post("/feeds", upload.single('video'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    try {
        // Upload the video file to Cloudinary using a buffer
        const uploadStream = cloudinary.uploader.upload_stream( // store file in cloudinary.
            { resource_type: 'video' },
            async (error, result) => {
                if (error) {
                    console.error("Cloudinary upload error:", error);
                    return res.status(500).json({ message: `Cloudinary upload error: ${error.message}` });
                }

                // Save the video URL in the database
                const videoUrl = result.secure_url; 
                const feed = new Model({
                    userId: req.body.userId,
                    userName: req.body.userName,
                    video: videoUrl,
                    title: req.body.title,
                    like: req.body.like,
                    comment: JSON.parse(req.body.comment),
                });

                await feed.save();
                res.status(201).json({ message: "Video uploaded successfully!", feed });
            }
        );

        // Write the buffer to the upload stream
        uploadStream.end(req.file.buffer);
    } catch (error) {
        console.error("Error during video upload:", error);
        res.status(500).json({ message: `Internal server error: ${error.message}` });
    }
});

/*----------------------------------------------------------This route handle requests for displaying all the reels ---------------------------------------------------------------- */
router.get("/receipess", async(req,res)=>{

    try {
        const response = await Model.find({});
        
        res.send(response)
        
    } catch (error) {
        console.log(error);
        
        res.status(500).json({message:`Error from the sever side ${error}`});
    }
})

/*-----------------------------------------------------------This route handles requets for liking the reel video--------------------------------------------------------------------*/
router.post("/like", async (req, res) => {
    const { id, userId } = req.body;

    try {
        // Find the recipe by ID
        const recipe = await Model.findById(id);

        if (!recipe) {
            return res.status(404).json({ message: "Recipe not found" });
        }

        // Check if the user has already liked the recipe
        if (recipe.like.includes(userId)) {
            // User has already liked the recipe, so we remove the like
            recipe.like = recipe.like.filter(like => like !== userId);
            await recipe.save();
            console.log(recipe);
            
            return res.status(200).json({ message: "Like removed", recipe });
        } else {
            // User has not liked the recipe, so we add the like
            recipe.like.push(userId);
            await recipe.save();
            return res.status(200).json({ message: "Like added", recipe });
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
});




/*-------------------------------------------------------------------This route handles requests for commenting on the reel---------------------------------------------------------*/
router.post("/comment", async (req, res) => {
    const id = req.body.id; // ID of the feed item
    const { userId, userName, comment } = req.body; // Extract userId, userName, and comment

    try {
        // Find the feed item by ID
        const data = await Model.findById({_id:id});

        if (!data) {
            return res.status(404).json({ message: "Feed item not found" });
        }

        // Create a new comment object
        const newComment = {
            userId,
            userName,
            text: comment
        };

        // Push the new comment to the comments array
        data.comment.push(newComment);

        // Save the updated feed item
        await data.save();

        // Respond with the updated data
        res.status(201).json(data);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "There is an error from server side" });
    }
});



module.exports = router;
