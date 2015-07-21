var User = require('./models/user');

module.exports = function(app,passport){
    app.get('/',function(req,res){
        res.render('login');
    });


    app.get('/auth/facebook', passport.authenticate('facebook', {scope: ['email']}));

    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', { successRedirect: '/index',
            failureRedirect: '/login' }));


    app.get('/logout', function(req, res){
        req.logout();
        res.redirect('/');
    })


};


function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/login');
}