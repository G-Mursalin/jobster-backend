const express = require("express");
const { protect } = require("./../controllers/authController");
const {
  createAjob,
  getAllJobs,
  deleteAJob,
  updateAJob,
  getStats,
  getMonthlyStats,
} = require("./../controllers/jobController");

// Routs
const router = express.Router();

router.get("/get-stats", protect, getStats);
router.get("/get-monthly-stats", protect, getMonthlyStats);

router.post("/add-job", protect, createAjob);
router.get("/", protect, getAllJobs);
router.route("/:id").delete(protect, deleteAJob).patch(protect, updateAJob);

module.exports = router;
