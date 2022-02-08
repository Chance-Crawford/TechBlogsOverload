const router = require('express').Router();
const req = require('express/lib/request');
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
    .then(dbUserData => {
        // create a session for the user and log them in.
        req.session.save(() => {
            // capture session variables to use later
            req.session.user_id = dbUserData.id;
            req.session.username = dbUserData.username;
            req.session.loggedIn = true;
        
            res.json(dbUserData);
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// login a pre existing user by comparing the password to the hashed password
// in the database.
router.post('/login', (req, res)=>{
    User.findOne({
        where: {
            // username in the database is unique
            username:  req.body.username
        }
    })
    .then(dbUserData =>{
        if (!dbUserData) {
            res.status(400).json({ message: 'No user with that username!' });
            return;
        }

        // compare password to the hashed password using the custom function,
        // returns a boolean on whether they match or not
        const validPassword = dbUserData.checkPassword(req.body.password);

        if (!validPassword) {
            res.status(400).json({ message: 'Incorrect password!' });
            return;
        }

        // if password is correct, log user in by creating a session
        req.session.save(()=>{
            // store user info in these session variables for when it is needed
            req.session.user_id = dbUserData.id;
            req.session.username = dbUserData.username;
            req.session.loggedIn = true;

            res.json({ user: dbUserData, message: 'You are now logged in!' });
        });
    })
});

// logout a user who is logged out
router.post('/logout', (req, res) => {
    if (req.session.loggedIn) {
        // destroys the user's session
        req.session.destroy(()=>{
            res.status(204).end();
        })
    }
    else {
        // if there is no session to destroy, respond with 404
        res.status(404).end();
    }
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