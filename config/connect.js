// ORM
const Sequelize = require('sequelize');

// Use environment variables to mask MySQL info
require('dotenv').config();

// changes our connection to the database depending on whether
// we are running the app locally or it is deployed to heroku.
let sequelize;

if (process.env.JAWSDB_URL) {
    // heroku database connection
    // connect to the heroku remote MySQL database hosted by heroku.
  sequelize = new Sequelize(process.env.JAWSDB_URL);
} else {
    // local connection, pass in our MySQL database info so Sequelize can connect
    // to it.
  sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PW, {
    host: 'localhost',
    dialect: 'mysql',
    port: 3306
  });
}

module.exports = sequelize;