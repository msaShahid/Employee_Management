const User = require("../models/userSchema");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const generateVerificationCode = require('../utils/generateVerificationCode');
const sendVerificationEmail = require('../services/mailService');


const createUser = async (req, res) => {
    try {
       // console.log(req.body);
        const { username, email, password, confirmPassword } = req.body;

        if (!username || !email || !password || !confirmPassword) {
            return res.status(400).json({ message: "All fields are required" });
        }
    
        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }

        const verificationCode = generateVerificationCode();

        console.log(verificationCode);

       // sendVerificationEmail(email, username, verificationCode);
        console.log("Starting email sending...");
        await sendVerificationEmail(email, username, verificationCode);
        console.log("Email sent.");

        const user = new User({ username, email, password, verificationCode, verificationExpiry: Date.now() + 3600000  });
        await user.save();

        const token = jwt.sign({user: user._id, email: user.email}, process.env.JWT_SECRET, {expiresIn: "1d"})
   
        res.status(201).json({
            message: "User registered successfully. Please verify your email." ,
            user: {
                id: user._id,
                email: user.email,
            },
            token
        })

    } catch(error) {

        console.error('Error during user signup:', error);
        if (error.name === 'ValidationError') {
            const errorMessages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ errors: errorMessages });
        }

        res.status(500).json({ message: "Signup failed!", error: error.message });
    }
};

const verifyUser = async (req, res) => {
    try {
        const { email, verificationCode } = req.body;

        if (!email || !verificationCode) {
            return res.status(400).json({ message: "Email and verification code are required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.verificationCode !== verificationCode) {
            return res.status(400).json({ message: "Invalid verification code" });
        }

        if (user.isVerificationCodeExpired()) {
            return res.status(400).json({ message: "Verification code has expired" });
        }

        user.isVerified = true; 
        user.verificationCode = undefined; 
        user.verificationExpiry = undefined; 
        await user.save();

        res.status(200).json({ message: "User verified successfully" });

    } catch (error) {
        res.status(500).json({ message: "Verification failed" });
    }
};


const loginUser = async (req, res) => {
    const {email, password} = req.body;

    if (!email || !password) {
        return res.status(400).json({ errors: { message: "Email and password are required" } });
    }

    try {

        const user = await User.findOne({email});

        if(!user){
            return res.status(401).json({errors: {message: "Invalid email or password"}})
        }

        const passwordMatch = await bcrypt.compare(password,user.password);

        if (!passwordMatch) {
           return res.status(401).json({ errors: { password: "Password is incorrect" } });
        }

        // Save session information
        req.session.user = { id: user._id, email: user.email };

        const token = jwt.sign(
            { userId: user._id, email: user.email }, 
            process.env.JWT_SECRET, 
            { expiresIn: "1d" }
        );

        req.session.token = token;
        res.cookie('authToken', token, {
            httpOnly: true, 
            secure: false,
            sameSite: 'Strict', 
            maxAge: 24 * 60 * 60 * 1000, 
        });

        res.status(200).json({
            user: {
                id: user._id,
                email: user.email,
                username: user.username, 
            },
            token
        });

    }catch(error){
        res.status(500).json({message: "Login is failed!"})
    }
}

const logoutUser = async (req, res) => {
    try {

        // Clear the session cookie from the user's browser
        res.clearCookie('connect.sid'); 
        res.clearCookie('authToken');  

        req.session.destroy((err) => {
            if (err) {
                console.error('Error destroying session:', err);
                return res.status(500).json({ message: 'Failed to log out' });
            }
        
            return res.status(200).json({ message: 'Successfully logged out' });
        });
      
    } catch (error) {
      console.error('Logout error:', error);
      return res.status(500).json({ message: 'An unexpected error occurred' });
    }
};
  
  

module.exports =  {createUser, verifyUser, loginUser, logoutUser};