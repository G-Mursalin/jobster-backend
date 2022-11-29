const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

// Schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please tell us your name"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Please tell us your email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    select: false,
    minLength: 8,
  },
  location: {
    type: String,
    default: "add your location",
  },
});

// *******Middlewares

// Save password(hashed) to DB
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// ********Methods

// Password Checked
userSchema.methods.checkPassword = async function (
  givenPassword,
  dbHashedPassword
) {
  return await bcrypt.compare(givenPassword, dbHashedPassword);
};

// Model
const User = mongoose.model("User", userSchema);

module.exports = User;
