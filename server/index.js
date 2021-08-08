require('dotenv').config();
const express = require('express');
const passport = require('passport');
const app = express();


app.use(passport.initialize());
app.use(passport.session());
//Middlewares
app.use(express.json());
app.use(express.urlencoded({extended: false}));


app.use(require('./routes/index'));

//Starting the server
const PORT=process.env.PORT
app.listen(PORT, ()=>{
    console.log(`Server listening on port ${PORT}`);
})