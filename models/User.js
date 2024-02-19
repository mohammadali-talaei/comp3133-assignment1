const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const userSchema = new Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true, // Removes whitespace from both ends
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true, // Removes whitespace from both ends
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long'],
  },
}, { timestamps: true }); // Adds createdAt and updatedAt timestamps

module.exports = model('User', userSchema);
