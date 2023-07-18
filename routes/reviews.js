const express = require('express');
// the '/campgrounds/:id/reviews' ID is not accessible to req.params under "ADD REVIEW" unless mergeParams is set to true here. Because it is in the app.js file
const router = express.Router({mergeParams: true});
const catchAsync = require('../utils/catchAsync');
const {campgroundSchema, reviewSchema} = require('../schemas.js')
const Campground = require('../models/campground');
const Review = require('../models/review');
const ExpressError = require('../utils/ExpressError');
const {isLoggedIn, isAuthor, isReviewAuthor, validateCampground, validateReview} = require('../middleware');
const reviews = require('../controllers/reviews')

//ADD REVIEW
router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReview))

//DELETE REVIEW
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview))

module.exports = router;