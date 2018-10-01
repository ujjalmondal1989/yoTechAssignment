module.exports = {
    database: 'mongodb+srv://ujjalNw:yoTech123***@cluster0-os85o.mongodb.net/yoTech?retryWrites=true',
    port: 3000,
    secretKey: "ANS$#AS",
    facebook:{
        clientID: '307616476717237',
        clientSecret: 'f7e06211139ebabc340ef42a1a315666',
        profileFields: ['emails','displayName'],
        callbackURL: 'http://localhost:3000/auth/facebook/callback'
    },
    google:{
        clientID: '305542172753-st5c43veibnrq2msrmpgh9335o2vsrg5.apps.googleusercontent.com',
        clientSecret:'XGD2ksYDuOJFgWmlHVVde64V',
        callbackURL: 'http://localhost:3000/auth/google/callback'
    }
}