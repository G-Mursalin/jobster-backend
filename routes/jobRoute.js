const express = require("express");
const { protect } = require("./../controllers/authController");
const {
  createAjob,
  getAllJobs,
  deleteAJob,
  updateAJob,
} = require("./../controllers/jobController");

// Routs
const router = express.Router();

router.post("/add-job", protect, createAjob);
router.get("/", protect, getAllJobs);
router.route("/:id").delete(protect, deleteAJob).patch(protect, updateAJob);

module.exports = router;
