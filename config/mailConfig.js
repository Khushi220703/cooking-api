const nodemailer = require("nodemailer");
const dotenv = require("dotenv")
dotenv.config();

/*This is mailer configuration*/
const transport = new nodemailer.createTransport({
    service:"Gmail",
    auth:{
        user:process.env.ACCOUNT,
        pass:process.env.PASSWORD 
    }

})

module.exports = transport;