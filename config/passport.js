// needed for local authentication
var passport = require('passport');

// needed for local login
var LocalStrategy = require('passport-local').Strategy;

// needed for facebook authentication
var FacebookStrategy = require('passport-facebook').Strategy;
// needed for google authentication
var GoogleStrategy = require('passport-google-oauth20').Strategy;

var secret = require('../config/secret');

var User = require('../models/user');



// serialize and deserialize
passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});


// give the middleware a name, and create a new anonymous instance of LocalStrategy
passport.use('local-login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, function(req, email, password, done) {
    // find a specific email
    User.findOne({ email: email }, function(err, user) {
        // incase of an error return a callback
        if (err) return done(err);

        if (!user) {
            return done(null, false, req.flash('loginMessage', 'No user with such credentials found'));
        }

        // compare user provided password and the database one
        if (!user.comparePassword(password)) {
            return done(null, false, req.flash('loginMessage', 'Oops! Wrong credentials'));
        }

        // return user object
        return done(null, user);

    });
}));

passport.use(new FacebookStrategy(secret.facebook, 
    function(token, refreshToken, profile, done) {    
        User.findOne({ facebook: profile.id }, function(err, user) {
            if (err) return next(err);

            if (user) {
                return done(null, user);
            } else {            
                var newUser = new User();
                newUser.email = profile._json.email;
                newUser.facebook = profile.id;
                newUser.tokens.push({ kind: 'facebook', token: token });
                newUser.profile.name = profile.displayName;

                newUser.save(function(err) {
                    if (err) return next(err);
                    return done(err, newUser);
                });            
            }
        });
    })
);

passport.use(new GoogleStrategy(secret.google,
  function(accessToken, refreshToken, profile, done) {
    User.findOne({ google: profile.id }, function(err, user) {
        if (err) return next(err);
        if (user) {
            return done(null, user);
        } else { 
            console.log(profile);           
            var newUser = new User();
            newUser.email = profile.emails[0].value;
            newUser.google = profile.id;
            newUser.tokens.push({ kind: 'google', token: accessToken });
            newUser.profile.name = profile.displayName;

            newUser.save(function(err) {
                if (err) return next(err);
                return done(err, newUser);
            });            
        }
    });
  })
);

// custom function validate
exports.isAuthenticated = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');

};
