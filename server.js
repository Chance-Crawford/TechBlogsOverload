const express = require('express');
const routes = require('./controllers');
const sequelize = require('./config/connect');
const path = require('path');
// Use environment variables to mask session info
require('dotenv').config();
// Creates a user session
const session = require('express-session');
// connects the session to MySQL database using sequelize
// and allows the user session to be stored in the 
// database.
const SequelizeStore = require('connect-session-sequelize')(session.Store);

// 1. To implement the custom helper functions, we need to start telling 
// Handlebars.js about the helpers file.
const helpers = require('./utils/helpers');
const exphbs = require('express-handlebars');
// 2. Then pass the helpers to the existing exphbs.create() statement
// This function used to be the default handlebar create initialization, exphbs.create({}).
// but the custom helper functions are passed into 
// the handlebar template engine creation.
// Now we can use the custom helper functions in handlebars templates!
const hbs = exphbs.create({ helpers });

// instantiates express server
const app = express();
// This uses Heroku's process.env.PORT 
// value for the port when deployed and 3001 when run locally.
const PORT = process.env.PORT || 3005;

// This code sets up an Express.js session and connects the session to our Sequelize 
// MySQL database.
const sess = {
    secret: process.env.THE_SECRET,
    cookie: {},
    resave: false,
    saveUninitialized: true,
    // sets up session storage in the database compatible with sequelize 
    // from the variable defined above.
    store: new SequelizeStore({
        // creates storage in database from the database connection
        db: sequelize
    })
}

// express middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// middleware to make the express server use the user session we created
app.use(session(sess));
// express.static() method is a built-in Express.js middleware function that 
// can take all of the contents of a folder and serve them as static assets. 
// This is useful for front-end specific files like images, style sheets, 
// and JavaScript files. These files can be accessed by other HTML files
// on the server without there being a specific route in the server set up for them
// every time, since the files in this folder are labeled as static.
app.use(express.static(path.join(__dirname, 'public')));
// make server use routes we created
app.use(routes);
// sets up handlebars templating engine, also uses the custom helpers for
// the engine that are added in above.
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

// start server on port
sequelize.sync({force: false}).then(() => {
    app.listen(PORT, () => console.log(`Now listening on Port: ${PORT}`));
});
