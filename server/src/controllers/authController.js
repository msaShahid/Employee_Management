const User = require("../models/userSchema");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");


const createUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const userExisit = await User.findOne({email})

        if(userExisit) {
            return res.status(400).json({errors: {email:"Email already exist"}})
        }

        const user = new User({ username, email, password });
        await user.save();

        const token = jwt.sign({user: user._id, email: user.email}, process.env.JWT_SECRET, {expiresIn: "1d"})

        res.status(201).json({
            user: {
                id: user._id,
                email: user.email,
               // password: user.password,
            },
            token
        })

    } catch(error) {

        if (error.name === 'ValidationError') {
            const errorMessages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ errors: errorMessages });
        }
        
        res.status(500).json({message: "Signup is failed!"})
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
  
  

module.exports =  {createUser, loginUser, logoutUser};