const User = require("./../models/userModel");
const { catchAsync } = require("./../utils/catchAsync");
const jwt = require("jsonwebtoken");

// Helping Functions
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

const sendToken = (user, statusCode, res) => {
  const token = generateToken(user._id);

  user.password = undefined;
  user.__v = undefined;
  res.status(statusCode).send({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

// Controllers
const signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);

  sendToken(newUser, 201, res);
});

module.exports = { signup };
