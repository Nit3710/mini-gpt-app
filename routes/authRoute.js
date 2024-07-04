const express=require('express');
const { registerController, loginController, logoutController } = require('../controllers/authController');
// router object 
const router=express.Router();

// routes api
// for register
router.post("/register",registerController)

// for login
router.post("/login",loginController);

// for logout
router.post("/logout",logoutController)



module.exports=router;