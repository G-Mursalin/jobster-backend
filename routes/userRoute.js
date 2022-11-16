const express = require("express");
const { signup, login, protect } = require("../controllers/authController");
const { updateMe } = require("../controllers/userController");
// Routs
const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/update-me", protect, updateMe);

module.exports = router;
