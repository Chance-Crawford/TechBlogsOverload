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
            loggedIn: req.session.loggedIn,
            onHome: false
        });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

// edit a blog post
router.get('/edit/:id', withAuth, (req, res)=>{
    Post.findOne({
        where: {
            id: req.params.id
        },
        attributes: ['id', 'title', 'post_text', 'created_at']
    })
    .then(dbPostData => {
        if(!dbPostData){
            res.status(404).json({ message: 'No post found with this id' });
            return;
        }

        const post = dbPostData.get({ plain: true });

        res.render('edit-post', {
            post,
            loggedIn: req.session.loggedIn,
            onHome: false
        });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

module.exports = router;