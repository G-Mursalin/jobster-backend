const express = require("express");
const { signup } = require("../controllers/authController");
// Routs
const router = express.Router();

router.post("/signup", signup);

module.exports = router;
