const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')
const JWT = require('jsonwebtoken');
const cookie = require("cookie");
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "username is required"]
    },
    email: {
        type: String,
        required: [true, "email is required"],
        unique: true

    }, password: {
        type: String,
        required: [true, "password is required"],
        minlength: [6, 'password length should be minimum 10 length']
    },
    customerId: {
        type: String,
        default: ""

    },
    subscription: {
        type: String,
        default: ""
    }
},
    {
        timestamps: true
    }
)
// hashed password
userSchema.pre('save', async function (next) {
    if (!this.isModified("password")) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
})

// match password
userSchema.methods.matchPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}

// sign token
userSchema.methods.getSignedToken = async function (req, res) {
    const accessToken = JWT.sign({ id: this._id }, process.env.SECRET_KEY, { expiresIn: process.env.SECRET_EXPIRESIN });
    const refreshToken = JWT.sign({ id: this._id }, process.env.SECRET_REFRESH, { expiresIn: process.env.SECRET_REFRESH_EXPIRESIN });
    res.cookie('refreshToken', `${refreshToken}`, { maxAge: 86400 * 1000 * 7000, httpOnly: true })
}


const User = mongoose.model("User", userSchema)
module.exports = User;