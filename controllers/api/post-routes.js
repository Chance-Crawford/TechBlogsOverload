const router = require('express').Router();
const { Post, User, Comment } = require('../../models');

// returns all posts for homepage
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
    .then(dbPostData => res.json(dbPostData))
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

// gets the information for a single blog post
router.get('/:id', (req, res)=>{
    Post.findOne({
        where: {
            id: req.params.id
        },
        attributes: ['id', 'title', 'post_text', 'created_at'],
        include: [
            // includes comments associated with the post
            {
                model: Comment,
                order: [['created_at', 'DESC']],
                attributes: ['id', 'comment_text', 'user_id', 'created_at'],
                // user who made each comment
                include: {
                    model: User,
                    attributes: ['username']
                }
            },
            // includes username of user who made the blog post
            {
                model: User,
                attributes: ['username']
            }
        ]
    })
    .then(dbPostData => {
        if(!dbPostData){
            res.status(404).json({ message: 'No post found with this id' });
            return;
        }

        res.json(dbPostData)
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

// create a new post, add it to the database
router.post('/', (req, res)=>{
    // create post in database from the request
    if(req.session){
        Post.create({
            title: req.body.title,
            post_text: req.body.post_text,
            user_id: req.session.user_id
        })
        .then(dbPostData => res.json(dbPostData))
        .catch(err => {
          console.log(err);
          res.status(500).json(err);
        });
    }
});

// update an existing post with new info
router.put('/:id', (req, res)=>{
    Post.update(
        {
            title: req.body.title,
            post_text: req.body.post_text
        },
        {
            where: {
                id: req.params.id
            }
        }
    )
    .then(dbPostData => {
        if(!dbPostData){
            res.status(404).json({ message: 'No post found with this id' });
            return;
        }

        res.json(dbPostData)
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

// delete a post from the database
router.delete('/:id', (req, res)=>{
    Post.destroy({
        where: {
            id: req.params.id
        }
    })
    .then(dbPostData => {
        if(!dbPostData){
            res.status(404).json({ message: 'No post found with this id' });
            return;
        }

        res.json(dbPostData)
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

module.exports = router