require("dotenv").config();
const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");


const transporter = nodemailer.createTransport({
  service: "gmail", 
  auth: {
    user: process.env.EMAIL_ADDRESS,
    pass: process.env.EMAIL_PASSWORD
  }
});

function sendVerificationEmail(to, username, verificationCode) {

    const templatePath = path.join(__dirname, "../views/verificationTemplate.html");
    let verificationtemplate = fs.readFileSync(templatePath, "utf-8");

    verificationtemplate = verificationtemplate.replace("{{username}}", username);
    verificationtemplate = verificationtemplate.replace("{{verificationCode}}", verificationCode);

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: to,
        subject: "Email Verification Code",
        html: verificationtemplate
    };

    return transporter.sendMail(mailOptions);
}

module.exports = sendVerificationEmail;
