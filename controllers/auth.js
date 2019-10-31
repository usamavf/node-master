const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/User');

exports.register = asyncHandler(async (req, res, next) => {

    const { name, email, password, role } = req.body;

    //create user
    const user = await User.create({
        name,
        email,
        password,
        role
    });

    // Create Token
    const token = user.getSignedJwtToken();

    res.status(200).json({
        success: true,
        token,
    });
});

exports.login = asyncHandler(async (req, res, next) => {

    const { email, password } = req.body;

    //validate email password
    if (!email || !password) {
        return next(
            new ErrorResponse('Please provide email and password', 400)
        );
    }

    // check for user
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
        return next(
            new ErrorResponse('Invalid Credentials', 401)
        );
    } 

    // check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
        return next(
            new ErrorResponse('Invalid Credentials', 401)
        );
    }

    // Create Token
    sendTokenResponse(user, 200, res);
});

exports.getMe = asyncHandler(async(req, res, next) => {
    const user = await User.findById(req.user.id);

    res.status(200).json({
        success: true,
        data: user
    });
});

// get token from model, create cookie and send resp
const sendTokenResponse = (user, statusCode, res) => {
    const token = user.getSignedJwtToken();

    // const options = {
    //     expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
    //     httpOnly: true,
    // };

    res.status(statusCode)
        //.cookie('token', token, options)
        .json({
            success: true,
            token: token
        });
}

