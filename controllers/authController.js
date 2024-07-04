const userModel = require('../models/userModel');
const errorResponse = require('../utils/errorResponse');
const errorHandler =require('../middlewares/errorMiddleware')

// jwt token
exports.sendToken = (user,statusCode, res) => {
    const token = user.getSignedToken(res);
    res.status(statusCode).json({
        success: true,
        token,
    })
}


// register controller
exports.registerController = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        //check for existing user
        const existing = await userModel.findOne({ email })
        if (existing) {
            return next(new errorResponse("already registered", 500));
        }
        const user = await userModel.create({ username, email, password });
        this.sendToken(user, 201, res);
    } catch (error) {
        console.log(error)
        next(error);
    }
}


// login controller
exports.loginController = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return next(new errorResponse("please provide email and password", 400))
        }
        const user = await userModel.findOne({ email });
        if (!user) {
            return next(new errorResponse("invalid credentials", 401))
        }
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return next(new errorResponse("invalid credentials", 401))
        }
        this.sendToken(user, 200, res)

    } catch (error) {
        console.log(error);
    }
}


// logout controller
exports.logoutController = async (req, res) => {
    res.clearCookie("refreshToken");
    return res.status(200).json({
      success: true,
      message: "Logout Succesfully",
    });
  };