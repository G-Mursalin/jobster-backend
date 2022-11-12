const express = require('express');
const {
  getAllTours,
  createATour,
  getATour,
  updateATour,
  deleteATour,
  checkId,
} = require('./../controllers/tourController');

const router = express.Router();

// router.param('id', checkId);
router.route('/').get(getAllTours).post(createATour);
router.route('/:id').get(getATour).delete(deleteATour).patch(updateATour);

module.exports = router;
