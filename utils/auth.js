//custom middleware function to make sure user is logged in before they
// connect to the dashboard page
function withAuth(req, res, next){
    if (!req.session.user_id) {
        res.redirect('/login');
    } else {
        next();
    }
}

module.exports = withAuth;