const AppError = require("./../utils/appError");

const sendResponse = (error, res) => {
  if (!error.isOperational) {
    console.log(error.message);
    return res.status(500).send({
      status: "error",
      message: "Something went wrong!",
    });
  } else {
    return res.status(error.statusCode).send({
      status: error.status,
      message: error.message,
    });
  }
};

const globalErrorController = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  let error = { ...err };
  if (err.name === "CastError") {
    error = new AppError(`Invalid ${err.path}: ${err.value}`, 400);
    return sendResponse(error, res);
  }

  if (err.code === 11000) {
    error = new AppError(
      `Duplicate field value ${err.message.match(
        /(["'])(?:(?=(\\?))\2.)*?\1/g
      )}. Please use another value!`,
      400
    );

    return sendResponse(error, res);
  }

  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map((val) => val.message);

    error = new AppError(`Invalid Input Data. ${errors.join(". ")}`, 400);
    return sendResponse(error, res);
  }

  sendResponse(err, res);
};

module.exports = { globalErrorController };
