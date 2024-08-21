
const express = require("express");
const userRoutes = require("./routes/loginRoutes");
const receipeRoutes = require("./routes/receipeRoutes");
const feedRoutes = require("./routes/feedRoutes")
const cors = require("cors");
const dotenv = require("dotenv")
const mongoose = require("mongoose");
dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

//connecting to the database.
mongoose.connect(process.env.URL).then(()=>console.log("Sucessfully connected to the database"))
.catch((e)=>console.log(e));


app.get("/", (req,res)=>{
    res.send("Hello from the server side!");
})


app.use("/api/user", userRoutes);
app.use("/api/food", receipeRoutes);
app.use("/api/feed",feedRoutes);


app.listen(PORT,()=>{
    console.log(`Hello from the server side. I am from ${PORT} port`);
    
})
