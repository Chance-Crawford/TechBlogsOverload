const router = require('express').Router();
const { User, Post, Comment } = require('../../models');

// return all users in the database
router.get('/', (req, res)=>{
    // return all users without their passwords
    User.findAll({
        attributes: { exclude: ['password'] }
    })
    .then(dbUserData => res.json(dbUserData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// find a single user and get their information
router.get('/:id', (req, res)=>{
    // return all users without their passwords
    User.findOne({
        attributes: { exclude: ['password'] },
        where: {
            id: req.params.id
        },
        include: [
            {
                model: Post,
                attributes: ['id', 'title', 'post_text', 'created_at']
            },
            // returns comments associated with the user
            // (comments this user has created)
            {
                model: Comment,
                attributes: ['id', 'comment_text', 'created_at'],
                // include the post that they commented on
                include: {
                    model: Post,
                    attributes: ['title']
                }
            }
        ]
    })
    .then(dbUserData => {
        if(!dbUserData){
            res.status(404).json({ message: 'No user found with this id' });
            return;
        }
        // otherwise return the user and all their info
        res.json(dbUserData)
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// add a new user by posting it to the database
router.post('/', (req, res)=>{
    User.create({
        // this password gets hashed for security before getting
        // saved in the database within User.js model configuration
        // function that was made. See the function in User.js
        password: req.body.password,
        username: req.body.username
    })
    // Make a user session after the user is created,
    // automatically logs them in
    .then(dbUserData => res.json(dbUserData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// delete a user from the database
router.delete('/:id', (req, res) => {
    User.destroy({
        where: {
          id: req.params.id
        }
    })
    .then(dbUserData => {
        if (!dbUserData) {
            res.status(404).json({ message: 'No user found with this id' });
            return;
        }
        res.json(dbUserData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

module.exports = router;