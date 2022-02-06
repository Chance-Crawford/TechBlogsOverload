// central hub for exporting models
const User = require('./User');
const Comment = require('./Comment');
const Post = require('./Post');

// create associations between tables/models

// User - post associations
User.hasMany(Post, {
    foreignKey: 'user_id'
});

Post.belongsTo(User, {
    foreignKey: 'user_id'
});

// comment associations
Comment.belongsTo(User, {
    foreignKey: 'user_id'
});

Comment.belongsTo(Post, {
    foreignKey: 'post_id'
});

User.hasMany(Comment, {
    foreignKey: 'user_id'
});

Post.hasMany(Comment, {
    foreignKey: 'post_id'
});

// This completes the associations, and makes it so that they are ready
// to be implemented in an api route.
module.exports = { User, Post, Comment };