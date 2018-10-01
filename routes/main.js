// external imports
var router = require('express').Router();
var passport = require('passport');
var multer = require('multer');

// custom imports
var User = require('../models/user');
var passportConf = require('../config/passport');

//multer setup
var storage = multer.diskStorage({
    destination: function(req,res,callback){
        callback(null,'./public/uploads');
    },
    filename:function(req,filename,callback){
        callback(null,Date.now()+filename.originalname);
    }
});

// landing page for login
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

//profile form route
router.get('/profile',passportConf.isAuthenticated, function (req, res) {
	res.render('accounts/dashboard',{user:req.user,message:req.flash('updated'),error:req.flash('error')});
});


// post profile route
router.post('/postProfile',passportConf.isAuthenticated, function (req, res) {
    User.findOne({ email: req.user.email }, function(err, existingUser) {
        if(err){
            req.flash('error', 'user not found');
            return  res.redirect('/profile');
        }
        //form file setup
        const fileUpload = multer({storage:storage}).single('profilePic');
        fileUpload(req,res,function(err){
            console.log(req.file);
            if(err){
                req.flash('error', 'Error uploading file'); 
                res.redirect('/profile');
            }
            if(req.file != undefined && req.file!= ''){
                const newFileName = req.file.filename;
                existingUser.profile.picture = newFileName;
            }
            
            existingUser.profile.name = req.body.username;            
            existingUser.address = req.body.useraddress;   
            existingUser.profile.designation = req.body.userdesignation;   
            existingUser.save(function(err) {
                if (err){
                    req.flash('error', 'Some error occured');
                    return res.redirect('/profile');
                }
                req.flash('updated', 'Successfully updated the details');
                return res.redirect('/profile');
            });     
        });
    });
});

router.get('/logout', function (req, res) {
	// terminate existing login session
    req.logout();
    // send user back to the home/landing page
    return res.redirect('/');
});

module.exports = router;
