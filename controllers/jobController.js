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

const getStats = catchAsync(async (req, res, next) => {
  const stats = await Job.aggregate([
    {
      $match: {},
    },
    {
      $group: {
        _id: "$status",
        numberOfTotalStats: { $sum: 1 },
      },
    },
  ]);

  res.status(200).send({
    status: "success",
    data: {
      stats,
    },
  });
});

const getMonthlyStats = catchAsync(async (req, res, next) => {
  // Calculate Date
  function subtract6Months(currentDate) {
    currentDate.setMonth(currentDate.getMonth() - 6);

    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const date = String(currentDate.getDate()).padStart(2, "0");

    return `${year}-${month}-${date}`;
  }

  const currentYear = new Date().getFullYear();
  const currentMonth = String(new Date().getMonth() + 1).padStart(2, "0");
  const currentDate = String(new Date().getDate()).padStart(2, "0");

  const sixMonthDateFromCurrentDate = subtract6Months(new Date());

  const stats = await Job.aggregate([
    {
      $match: {
        createAt: {
          $gte: new Date(sixMonthDateFromCurrentDate),
          $lte: new Date(`${currentYear}-${currentMonth}-${currentDate}`),
        },
      },
    },
    {
      $group: {
        _id: { $month: "$createAt" },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
    {
      $addFields: {
        month: {
          $let: {
            vars: {
              monthsInString: [
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun",
                "July",
                "Aug",
                "Sep",
                "Oct",
                "Nov",
                "Dec",
              ],
            },
            in: {
              $arrayElemAt: ["$$monthsInString", { $subtract: ["$_id", 1] }],
            },
          },
        },
      },
    },
  ]);

  res.status(200).send({
    status: "success",
    data: {
      stats,
    },
  });
});

module.exports = {
  createAjob,
  getAllJobs,
  deleteAJob,
  updateAJob,
  getStats,
  getMonthlyStats,
};
