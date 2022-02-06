const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connect');

// to check encrypted password with user login
const bcrypt = require('bcrypt');

class User extends Model{
    checkPassword(loginPass){
        // Using the keyword this, we can access this user's 
        // properties, including the password, which was stored as a hashed string.
        return bcrypt.compareSync(loginPass, this.password);
    }
}

// init columns for table/model in database
User.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        username: {
            type: DataTypes.STRING, 
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                // this means the password must be at least six 
                // characters long
                len: [6]
            }
        }
    },
    {
        // hooks are functions that are called before or after calls in Sequelize.
        // In this case we are adding a hook to hash the user's password before
        // the user is added and created in the database.
        hooks: {
            // beforeCreate() is a prebuilt hook function in sequelize that performs actions
            // before the user is created
            async beforeCreate(newUser){
                // hash the password
                // newUser = this user being created, hash before adding
                // to database
                // hash by a value of 10, the higher the better but also more 
                // time to execute.
                newUser.password = await bcrypt.hash(newUserData.password, 10);
                // now continue with the call to add the user to the database.
                return newUser;
            }
        },

        // Database connection and table config
        sequelize,
        // don't automatically create 
        // createdAt/updatedAt timestamp fields for users
        timestamps: false,
        // don't pluralize name of database table
        freezeTableName: true,
        // use underscores for column names
        underscored: true,
        // model name in the database is lowercase
        modelName: 'user'

    }
);

module.exports = User;