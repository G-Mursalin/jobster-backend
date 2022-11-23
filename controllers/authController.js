const User = require("./../models/userModel");
const { catchAsync } = require("./../utils/catchAsync");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const AppError = require("../utils/appError");

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

const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("Please provide credentials", 400));
  }
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.checkPassword(password, user.password))) {
    return next(new AppError("Incorrect password or email", 401));
  }

  sendToken(user, 201, res);
});

const protect = catchAsync(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(new AppError("You are not authorized.Please login", 401));
  }

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  const freshUser = await User.findById(decoded.id);

  if (!freshUser) {
    return next(new AppError("The user does not exits", 401));
  }

  req.user = freshUser;
  req.token = token;
  next();
});

module.exports = { signup, login, protect };
