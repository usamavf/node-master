const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add Email'],
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
    },
    role: {
        type: String,
        enum: ['user', 'publisher'],
        default: 'user'
    },
    password: {
        type: String,
        required: [true, 'Please enter password'],
        minlength: [6, 'Password should be minim of 6 length'],
        select: false,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
});

// Encrypt password
UserSchema.pre('save', async function() {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function() {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });
}

// Match user entered password to hashed password in db
UserSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
}

UserSchema.set('timestamps', true);

module.exports = mongoose.model('User', UserSchema);