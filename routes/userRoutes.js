const express = require("express");
const router = express.Router();
const { userController, registerUser }= require('../controllers/userController');

router.post("/register", registerUser);
router.post("/login", userController);


module.exports = router;