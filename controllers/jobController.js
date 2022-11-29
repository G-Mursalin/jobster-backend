const AppError = require("../utils/appError");
const { catchAsync } = require("./../utils/catchAsync");
const Job = require("./../models/jobModel");

// Controllers
const createAjob = catchAsync(async (req, res, next) => {
  const newJob = await Job.create(req.body);
  newJob.__v = undefined;
  res.status(201).send({ status: "success", data: { job: newJob } });
});

const getAllJobs = catchAsync(async (req, res, next) => {
  const jobs = await Job.find();
  res
    .status(200)
    .send({ status: "success", results: jobs.length, data: { jobs } });
});

const deleteAJob = catchAsync(async (req, res, next) => {
  const doc = await Job.findByIdAndDelete(req.params.id);
  if (!doc) {
    return next(new AppError("No job information found with that ID", 404));
  }
  res.status(204).send({ status: "successfully deleted", data: null });
});

const updateAJob = catchAsync(async (req, res, next) => {
  const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!updatedJob) {
    return next(new AppError("No job information found with that ID", 404));
  }

  res.status(200).send({
    status: "successfully updated",
    data: {
      updatedJob,
    },
  });
});

module.exports = { createAjob, getAllJobs, deleteAJob, updateAJob };
