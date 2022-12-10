const AppError = require("../utils/appError");
const { catchAsync } = require("./../utils/catchAsync");
const Job = require("./../models/jobModel");
const APIFeatures = require("../utils/apiFeatures");

// Controllers
const createAjob = catchAsync(async (req, res, next) => {
  const newJob = await Job.create(req.body);
  newJob.__v = undefined;
  res.status(201).send({ status: "success", data: { job: newJob } });
});

const getAllJobs = catchAsync(async (req, res, next) => {
  // const jobs = await Job.find();
  const features = new APIFeatures(Job.find(), req.query)
    .filter()
    .sort()
    .pagination();

  const featuresFilter = new APIFeatures(Job.find(), req.query).filter();
  const filtersQuery = await featuresFilter.query;
  const totalJobs = filtersQuery.length;

  const jobs = await features.query;
  const page = req.query.page;
  const numOfPages = Math.ceil(totalJobs / 10);

  res.status(200).send({
    status: "success",
    results: jobs.length,
    data: {
      jobs,
      totalJobs,
      page,
      numOfPages,
    },
  });
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

  const statsObj = {};
  stats.map((val) => (statsObj[val._id] = val.numberOfTotalStats));

  res.status(200).send({
    status: "success",
    data: {
      stats: statsObj,
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
  function add1Day(currentDate) {
    currentDate.setDate(currentDate.getDate() + 1);

    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const date = String(currentDate.getDate()).padStart(2, "0");

    return `${year}-${month}-${date}`;
  }

  const stats = await Job.aggregate([
    {
      $match: {
        createAt: {
          $gte: new Date(subtract6Months(new Date())),
          $lte: new Date(add1Day(new Date())),
        },
      },
    },
    {
      $group: {
        // _id: { $month: "$createAt", year: "$createAt" },
        _id: {
          month: { $month: "$createAt" },
          year: { $year: "$createAt" },
        },
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
              $arrayElemAt: [
                "$$monthsInString",
                { $subtract: ["$_id.month", 1] },
              ],
            },
          },
        },
      },
    },
    {
      $addFields: {
        monthYear: {
          $concat: ["$month", "-", { $toString: "$_id.year" }],
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
