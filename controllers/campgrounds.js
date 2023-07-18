const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const Campground = require('../models/campground');
const {isLoggedIn, isAuthor, validateCampground} = require('../middleware');
const {cloudinary} = require("../cloudinary");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mbxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({accessToken: mbxToken});


module.exports.index=async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds})
}


module.exports.renderNewForm=(req, res) => {
    res.render('campgrounds/new')
}

module.exports.createCampground=async (req, res) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send();
    const campground = new Campground(req.body.campground);
    //extract image data to store in mongo
    campground.images = req.files.map(f => ({url: f.path, filename: f.filename}));
    campground.geometry = geoData.body.features[0].geometry;
    //add currently logged in user as campground author
    campground.author = req.user._id;
    await campground.save();
    console.log(campground);
    req.flash('success', 'Successfully entered a campground');
    res.redirect(`campgrounds/${campground._id}`)
}

module.exports.showCampground=async (req, res) => {
    const {id} = req.params; 
    const campground = await Campground.findById(id).populate({
        path:'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if(!campground){
        req.flash('error', 'Cannot find that campground.');
        return res.redirect(`/campgrounds`)
    }
    res.render('campgrounds/show', {campground})
}

module.exports.renderEditForm=async (req, res) => {
    const {id} = req.params; 
    const campground = await Campground.findById(id);
    if(!campground){
        req.flash('error', 'Cannot find that campground.');
        return res.redirect(`/campgrounds`)
    }
    res.render('campgrounds/edit', {campground})
}


module.exports.updateCampground=async (req, res) => {
    const {id} = req.params; 
    console.log(req.body)
    const camp = await Campground.findByIdAndUpdate(id, {...req.body.campground});
    const images = req.files.map(f => ({url: f.path, filename: f.filename}));
    camp.images.push(...images);
    if(req.body.deleteImages) {
        for(let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename)
        }
        await camp.updateOne({$pull: {images: {filename: {$in: req.body.deleteImages}}}}); 
        console.log(camp)
    }

    await camp.save();
    req.flash('success', 'Successfully updated a campground');
    res.redirect(`/campgrounds/${camp._id}`)
}

module.exports.deleteCampground=async (req, res) => {
    const {id} = req.params;
    const camp = await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted a campground');
    res.redirect(`/campgrounds`)
}