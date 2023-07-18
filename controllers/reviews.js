const express = require('express');
// the '/campgrounds/:id/reviews' ID is not accessible to req.params under "ADD REVIEW" unless mergeParams is set to true here. Because it is in the app.js file
const router = express.Router({mergeParams: true});
const catchAsync = require('../utils/catchAsync');
const {campgroundSchema, reviewSchema} = require('../schemas.js')
const Campground = require('../models/campground');
const Review = require('../models/review');
const ExpressError = require('../utils/ExpressError');
const {isLoggedIn, isAuthor, isReviewAuthor, validateCampground, validateReview} = require('../middleware');

module.exports.createReview=async (req, res) => {
    const {id} = req.params; 
    const campground = await Campground.findById(id);
    const review = new Review(req.body.review);
    review.author = req.user._id
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'Successfully created a review');
    res.redirect(`/campgrounds/${campground._id}`)
}


module.exports.deleteReview=async (req, res) => {
    const {id, reviewId} = req.params; 
    const campground = await Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    const review = await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted a review');
    res.redirect(`/campgrounds/${id}`)
}