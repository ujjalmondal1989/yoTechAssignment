// external imports
var router = require('express').Router();
var passport = require('passport');

// custom imports
var User = require('../models/user');
var passportConf = require('../config/passport');

router.get('/', function (req, res) {
	if (req.isAuthenticated()) {
      return res.redirect("/profile");
    }
	res.render('accounts/login');
});

/**
 * Handle GET HTTP requests from Facebook authentication
 */
router.get('/auth/facebook', passport.authenticate('facebook', { scope: 'email' }));

/**
 * Handles GET HTTP results from Facebook authentication
 */
router.get('/auth/facebook/callback', passport.authenticate('facebook', {
    successRedirect: '/profile',
    failureRedirect: '/'
}));

/**
 * Handle GET HTTP requests from Google authentication
 */
router.get('/auth/google', passport.authenticate('google', { scope: 'email' }));

/**
 * Handles GET HTTP results from Google authentication
 */
router.get('/auth/google/callback', passport.authenticate('google', {
    successRedirect: '/profile',
    failureRedirect: '/'
}));


router.get('/profile',passportConf.isAuthenticated, function (req, res) {
	res.render('accounts/dashboard',{user:req.user});
});

router.get('/logout', function (req, res) {
	// terminate existing login session
    req.logout();
    // send user back to the home/landing page
    return res.redirect('/');
});

module.exports = router;
