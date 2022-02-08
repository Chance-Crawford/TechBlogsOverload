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
        res.render('home', { 
            posts,
            loggedIn: req.session.loggedIn
        });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

// renders HTML page for a single post and passes the post's data
router.get('/post/:id', (req, res)=>{
    Post.findOne({
        where: {
            id: req.params.id
        },
        attributes: ['id', 'title', 'post_text', 'created_at'],
        include: [
            // includes comments associated with this post
            {
                model: Comment,
                attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
                // user who made each comment
                include: {
                    model: User,
                    attributes: ['username']
                }
            },
            // includes username of user who made this post
            {
                model: User,
                attributes: ['username']
            }
        ]
    })
    .then(dbPostData => {
        if (!dbPostData) {
          res.status(404).json({ message: 'No post found with this id' });
          return;
        }
  
        // serialize the data to regular object
        const post = dbPostData.get({ plain: true });

        // render single post page and pass in the data from the database
        res.render('single-post', {
            post,
            loggedIn: req.session.loggedIn
        });
    })
});

// renders login page html template
router.get('/login', (req, res) => {
    // if user already logged in, redirect to homepage
    if (req.session.loggedIn) {
        res.redirect('/');
        return;
    }
    
    // if not already logged in, send to login/create account page
    res.render('login');
});

module.exports = router;