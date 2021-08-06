require('dotenv').config();
const express = require('express');
const app = express();

//Middlewares
app.use(express.json());
app.use(express.urlencoded({extended: false}));


app.use(require('./routes/index'));

//Starting the server
const PORT=process.env.PORT
app.listen(PORT, ()=>{
    console.log(`Server listening on port ${PORT}`);
})