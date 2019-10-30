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
    if(!email || !password) {
        return next(
            new ErrorResponse('Please provide email and password', 400)
        );
    }

    // check for user
    const user = await User.findOne({ email }).select('+password');

    if(!user) {
        return next(
            new ErrorResponse('Invalid Credentials', 401)
        );
    }

    // check if passwored matches
    const isMatch = await user.matchPassword(password);

    if(!isMatch) {
        return next(
            new ErrorResponse('Invalid Credentials', 401)
        );
    }

    // Create Token
    const token = user.getSignedJwtToken();

    res.status(200).json({
        success: true,
        token
    });
});

