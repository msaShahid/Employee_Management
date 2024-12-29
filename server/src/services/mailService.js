require("dotenv").config();
const nodemailer = require("nodemailer");


const transporter = nodemailer.createTransport({
  service: "gmail", 
  auth: {
    user: process.env.EMAIL_ADDRESS,
    pass: process.env.EMAIL_PASSWORD
  }
});

function sendVerificationEmail(to, verificationCode) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: to,
    subject: "Email Verification Code",
    html: `<p>Your verification code is: <strong>${verificationCode}</strong></p>`
  };

  return transporter.sendMail(mailOptions);
}

module.exports = sendVerificationEmail;
