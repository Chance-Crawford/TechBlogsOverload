const router = require('express').Router();

// use all api routes under their designated paths
router.use('/users', require('./user-routes'));
router.use('/posts', require('./post-routes'));
router.use('/comments', require('./comment-routes'));

module.exports = router;
