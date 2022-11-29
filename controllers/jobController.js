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

module.exports = { createAjob, getAllJobs };
