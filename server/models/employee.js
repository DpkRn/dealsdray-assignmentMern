const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema(
  {
    f_Name: {
      type: String,
      required: true,
    },
    f_Email: {
      type: String,
      required: true,
      unique: true,
    },
    f_Mobile: {
      type: String,
      required: true,
    },
    f_Designation: {
      type: String,
      enum: ["HR", "Manager", "Sales"],
      required: true,
    },
    f_Course: {
      type: Array, // Array of strings
      required: true,
    },
    f_Gender: {
      type: String,
      enum: ["M", "F"],
      required: true,
    },
    f_Image: {
      type: String,
      default: null,
    },
    f_Create_date: {
      type: Date,
      default: Date.now, // Sets default date to current date
    },
  },
  { timestamps: true } // Adds createdAt and updatedAt fields
);

module.exports = mongoose.model('Employee', employeeSchema);
