const express = require('express');
const {
  getAllUsers,
  postAUser,
  getAUser,
  deleteAUser,
  updateAUser,
} = require('./../controllers/userController');
// Routs
const userRoute = express.Router();
userRoute.route('/').get(getAllUsers).post(postAUser);
userRoute.route('/:id').get(getAUser).delete(deleteAUser).patch(updateAUser);

module.exports = userRoute;
