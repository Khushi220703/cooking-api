const mongoose = require("mongoose");


/* This is recipe model have info about receipe like user who add that recipe, name, time required, ingredients, 
instructions, meal type, image, cuisine, video, category, like and comment of video . */

const schema = new mongoose.Schema({
  userName:{
    type:String,
    
  },
  name: {
    type: String,
    
  },
  prepTime: {
    type: String, 
    
  },
  ingredients: {
    type: [String], 
    
  },
  instructions: {
    type: [String], 
    
  },
  mealType: {
    type: [String],
    
  },
  image: {
    type: String,
  },
  cuisine: {
    type: String,
    
  },
  video: {
    type: String,
  },
  category:{
    type:String
  },
  like:{
    type:Number
  },
  comment:{
    type:[String]
  }
});

const ReceipeModel = mongoose.model("ReceipeModel", schema);

module.exports = ReceipeModel;