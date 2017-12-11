const envVariables = require('./env/env.js');


var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var User = require('./models/User.js');


const posts = [
    {message: 'hello'},
    {message: 'hi'}
];

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

app.use(bodyParser.json());

app.get('/posts', (req, res) => {
    res.send(posts);
});

app.post('/register', (req, res) => {
    const userData = req.body;
    const user = new User(userData)

    user.save((err, result) => {
        if(err) console.log('error when saving user');
        res.sendStatus(200);
    });
});

mongoose.connect(`mongodb://${envVariables.dbUser}:${envVariables.dbPassword}@ds135186.mlab.com:35186/mean-social-site`, {useMongoClient: true}, (err) => {
    if (!err) console.log('connected correctly');
});

app.listen(3000, () => {
    console.log('app running and listen localhost port 3000');
});