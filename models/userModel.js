const mongoose = require("mongoose");


/* This model have info about user who created accounts in this app. */
const schema = new mongoose.Schema({
    name:{
        type:String,
    },
    password:{
        type:String,
    },
    email:{
        type:String,
    },
    city:{
        type:String,
    },
    age:{
        type:Number,
    },
    gender:{
        type:String,
    }
})

const Model = new mongoose.model("Model",schema);

module.exports = Model;