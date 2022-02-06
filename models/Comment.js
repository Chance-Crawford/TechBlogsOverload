const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connect');

class Comment extends Model{}

// init columns for table/model in database
Comment.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        comment_text: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                // must have length of at least 1
                len: [1]
            }
        },
        // user who created the comment
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            // foreign key for user model, user who made the comment.
            references: {
                model: 'user',
                key: 'id'
            }
        },
        // post the comment is on
        post_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'post',
                key: 'id'
            }
        }
    },
    {
        sequelize,
        freezeTableName: true,
        underscored: true,
        modelName: 'comment'
    }
);

module.exports = Comment;