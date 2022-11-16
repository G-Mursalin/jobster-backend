const express = require("express");
const app = express();
const userRoute = require("./routes/userRoute");
const AppError = require("./utils/appError");
const { globalErrorController } = require("./controllers/errorController");

//Middleware
app.use(express.json());

//Routs

app.use("/api/v1/users", userRoute);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't not fine ${req.originalUrl}`, 404));
});

app.use(globalErrorController);

module.exports = app;
