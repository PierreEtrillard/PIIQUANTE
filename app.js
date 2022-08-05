const express = require('express')
const app = express();
const mongoose = require('mongoose')
const usersRoutes = require('./routes/users')
const saucesRoutes = require('./routes/sauces')

mongoose.connect('mongodb+srv://pierre:4LWMeLzsTtEhM1pV@pricipal.tpemf.mongodb.net/?retryWrites=true&w=majority',{
    useNewUrlParser : true ,
    useUnifiedTopology :true
})
.then(()=>console.log("MongoDB connectée"))

//***********************               ROUTES USERS             *************************/
app.use(express.json())
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });
app.use('/api/auth',usersRoutes)
app.use('/api/sauces',saucesRoutes)

module.exports = app;