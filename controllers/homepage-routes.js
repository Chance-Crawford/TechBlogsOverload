const router = require('express').Router();
const { Post, User, Comment } = require('../models');

// pass post data to HTML template and render the homepage
// with the data
router.get('/', (req, res)=>{
    Post.findAll({
        attributes: ['id', 'title', 'created_at'],
        order: [['created_at', 'DESC']],
        include: [
            // includes comments associated with each post (to display comment count)
            {
                model: Comment,
                attributes: ['id']
            },
            // includes username of user who made each of the posts
            {
                model: User,
                attributes: ['username']
            }
        ]
    })
    .then(dbPostData => {
        // serialize data in the array to normal objects
        const posts = dbPostData.map(post => post.get({ plain: true }));
        res.render('home', { posts });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

module.exports = router;