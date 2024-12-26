const {createUser, loginUser, logoutUser} = require("../controllers/authController");
//const { authenticate } = require("../middleware/authMiddleware");

const express = require('express');
const router = express.Router();


router.post('/singup', createUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);

module.exports = router;