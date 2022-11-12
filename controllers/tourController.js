const Tour = require("./../models/tourModel");
const APIFeatures = require("./../utils/apiFeatures");
const { catchAsync } = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");

const getAllTours = catchAsync(async (req, res) => {
  const features = new APIFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .filterLimiting()
    .pagination();
  const tours = await features.query;

  res.status(200).send({
    status: "success",
    results: tours.length,
    tours,
  });
});

const createATour = catchAsync(async (req, res) => {
  const newTour = await Tour.create(req.body);
  res.status(201).send({ status: "Tour Created Successfully", data: newTour });
});

const getATour = catchAsync(async (req, res) => {
  const tour = await Tour.findById(req.params.id);
  if (!tour) {
    return next(new AppError("No tour found with that ID", 404));
  }
  res.status(200).send({ status: "success", tour });
});

const updateATour = catchAsync(async (req, res) => {
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!tour) {
    return next(new AppError("No tour found with that ID", 404));
  }
  res.status(200).send({ status: "successfully updated", updated_data: tour });
});

const deleteATour = catchAsync(async (req, res) => {
  const tour = await Tour.findByIdAndDelete(req.params.id);
  if (!tour) {
    return next(new AppError("No tour found with that ID", 404));
  }
  res.status(204).send({ status: "successfully deleted", data: null });
});

module.exports = {
  getAllTours,
  createATour,
  getATour,
  updateATour,
  deleteATour,
};
