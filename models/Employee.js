const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const employeeSchema = new Schema({
  first_name: {
    type: String,
    required: [true, 'First name is required'] 
  },
  last_name: {
    type: String,
    required: [true, 'Last name is required']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    match: [/.+\@.+\..+/, 'Please fill a valid email address'] 
  },
  gender: {
    type: String,
    required: [true, 'Gender is required'],
    enum: ['Male', 'Female', 'Other']
  },
  salary: {
    type: Number,
    required: [true, 'Salary is required'],
    min: [0, 'Salary cannot be negative']
  }
}, {
  timestamps: true
});

module.exports = model('Employee', employeeSchema);