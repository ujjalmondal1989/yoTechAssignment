var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var crypto = require('crypto');
var Schema = mongoose.Schema;

var UserSchema = new Schema({

	email: {type: String, unique: true, lowercase: true,require:true},

	facebook: String,

	google: String,

	tokens: Array,

	password: String,

	profile: {
		name: {type: String, default: ''},
		picture: {type: String, default: ''},
		designation:{type: String, default: ''}
	},

	address: String
});

UserSchema.pre('save', function(next){

	var user = this;
	
	if (!user.isModified('password')) return next();

	// generate the salt
	bcrypt.genSalt(10, function(err, salt){

		bcrypt.hash(user.password, salt, function(err, hash){
			
			if (err) return next(err);

			user.password = hash;			
			next();	
		});
	});
});

/*compare database password with user user entered password */
UserSchema.methods.comparePassword = function(userPassword){	
	return bcrypt.compareSync(userPassword, this.password);
}

module.exports = mongoose.model('User', UserSchema);