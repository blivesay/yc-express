const express = require('express');
const router = express.Router();
const passport = require('passport')
const User = require('../models/user');
const {storeReturnTo} = require('../middleware');
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');

module.exports.renderRegister=(req, res) => {
    res.render('users/register')
}

module.exports.register=async (req, res) => {
    try {
        const {username, email, password} = req.body;
        const user = new User({email, username})
        const registeredUser = await User.register(user, password)
        // login with the successful registration using .login, requires callback so .flash and .redirect are included under it
        req.login(registeredUser, err => {
            if(err) {
                return next(err)
            }
            req.flash('success', `Welcome to Yelp Camp, ${req.user.username}`)
            res.redirect('/campgrounds')
        })
        
    } catch (error) {
        req.flash('error', error.message)
        res.redirect('register')
    }
}

module.exports.renderLogin=(req, res) => {
    res.render('users/login')
}

module.exports.login=(req, res) => {
    req.flash('success', `Welcome to Yelp Camp, ${req.user.username}`);
    const redirectUrl = res.locals.returnTo || '/campgrounds';
    res.redirect(redirectUrl)
}

module.exports.logout=(req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        };
        req.flash('success', 'Goodbye!');
        res.redirect('/campgrounds');
})
}