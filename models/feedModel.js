const mongoose = require("mongoose");

/*There are three model "feedModel" is one of them it has info about user who add reel and title and reel video likes and comments.*/

/* This is comment schema have info about user who commented and their comment.*/
const commentSchema = new mongoose.Schema({
    userId:{
        type:String,
        
    },
    userName:{
        type:String
    },
    text:{
        type:String
    }
})

/*This is schema for feed.*/
const schema = new mongoose.Schema({
    userId:{
        type:String
    },
    userName:{
        type:String
    },
    title:{
        type:String
    },
    video:{
        type:String
    },
    like:{
        type:[String]
    },
    comment:{
        type:[commentSchema]
    }
});

const FeedModel = new mongoose.model("FeedModel", schema);

module.exports = FeedModel;