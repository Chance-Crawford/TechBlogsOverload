const router = require('express').Router();

router.use('/api', require('./api'));
router.use('/', require('./homepage-routes'));
// default route to send when user requests a route that is not there.
router.use((req, res) => {
    res.status(404).end();
});

module.exports = router;