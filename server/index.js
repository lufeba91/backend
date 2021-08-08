require('dotenv').config();
const express = require('express');
const passport = require('passport');
const session = require('express-session');
const { pool } = require('./controllers/index.controllers');
const pgSession = require('connect-pg-simple')(session);
require('../utils/passport-local')

const app = express();

app.use(session({
    secret: process.env.secret,
    resave: false,
    saveUninitialized: true,
    store: new pgSession({
        pool: pool,
        tablename: 'user_sessions'
    }),
    cookie: {
        maxAge: 1000*60*60
    }
}))


//Middlewares

app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use(express.urlencoded({extended: false}));


app.use(require('./routes/index'));

//Starting the server
const PORT=process.env.PORT
app.listen(PORT, ()=>{
    console.log(`Server listening on port ${PORT}`);
})