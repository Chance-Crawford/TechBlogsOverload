// HTML routes dealing with the dashboard page
const router = require('express').Router();
const { Post, User, Comment } = require('../models');

// custom middleware function, makes sure user is logged in to access dashboard
const withAuth = require('../utils/auth');

// renders dashboard page
router.get('/', withAuth, (req, res)=>{
    Post.findAll({
        // find all posts where the user id is equal to the user who is 
        // logged in.
        where: {
            user_id: req.session.user_id
        },
        attributes: ['id', 'title', 'created_at'],
        order: [['created_at', 'DESC']],
        include: [
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
        res.render('dashboard', { 
            posts,
            loggedIn: req.session.loggedIn
        });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

module.exports = router;