var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var crypto = require('crypto');
var Schema = mongoose.Schema;

var UserSchema = new Schema({

	email: {type: String, unique: true, lowercase: true},

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

	/* this refers to the user passed as argument to the save method in /routes/user*/
	var user = this;
	// console.log(user) to get an idea of what the user object contains : TODO: remove this

	/* only hash the password if it has been modified or its new */
	if (!user.isModified('password')) return next();

	// generate the salt
	bcrypt.genSalt(10, function(err, salt){

		/* hash the password using the generated salt */
		bcrypt.hash(user.password, salt, function(err, hash){
			
			/* if an error has occured we stop hashing */
			if (err) return next(err);

			/* override the cleartext (user entered) passsword with the hashed one */
			user.password = hash;
			/*return a callback */
			next();	
		});
	});
});

/*compare database password with user user entered password */
UserSchema.methods.comparePassword = function(userPassword){
	/* this.password refers to the database password, 
	userPassword to the password the user entered on the login form*/
	return bcrypt.compareSync(userPassword, this.password);
}

module.exports = mongoose.model('User', UserSchema);