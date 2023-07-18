const {campgroundSchema, reviewSchema} = require('./schemas.js');
const Campground = require('./models/campground');
const Review = require('./models/review');
const ExpressError = require('./utils/ExpressError');

//Joi validation middleware campground form
module.exports.validateCampground = (req, res, next) => {
    //campgroundSchema defined in schemas.js
    //'joi' is required in schemas.js
    const {error} = campgroundSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }    
}
//end Joi validation middleware

//Joi validation middleware review form
module.exports.validateReview = (req, res, next) => {
    //reviewSchema defined in schemas.js
    //'joi' is required in schemas.js
    const {error} = reviewSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }    
}
//end Joi validation middleware

module.exports.isReviewAuthor = async (req, res, next) => {
    const {id, reviewId} = req.params; 
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}

module.exports.isAuthor = async (req, res, next) => {
    const {id} = req.params; 
    const campground = await Campground.findById(id);
    if (!campground.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}

module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl
        req.flash('error', 'You must be signed in')
        return res.redirect('/login')
    }
    next();
}

module.exports.storeReturnTo = (req, res, next) => {
	    if (req.session.returnTo) {
	        res.locals.returnTo = req.session.returnTo;
	    }
	    next();
}