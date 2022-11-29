const express = require("express");
const { protect } = require("./../controllers/authController");
const { createAjob, getAllJobs } = require("./../controllers/jobController");

// Routs
const router = express.Router();

router.post("/add-job", protect, createAjob);
router.get("/", protect, getAllJobs);

module.exports = router;
