const envVariables = require('./env/env.js');


var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var User = require('./models/User.js');
var jwt = require('jwt-simple');
var bcrypt = require('bcrypt-nodejs');

mongoose.Promise = Promise;

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

app.get('/users', async (req, res) => {
    try {
        const users = await User.find({}, '-password -__v');
        res.send(users);
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
});

app.get('/profile/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id, '-password -__v');
        res.send(user);
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
});

app.post('/register', (req, res) => {
    const userData = req.body;
    const user = new User(userData);

    user.save((err, result) => {
        if(err) console.log('error when saving user');
        res.sendStatus(200);
    });
});

app.post('/login', async (req, res) => {
    const loginData = req.body;
    
    const user = await User.findOne({email: loginData.email});

    if (!user) return res.status(401).send({message: 'Email or Password invalid'});
    bcrypt.compare(loginData.password, user.password, (err, isMatch) => {
        if (!isMatch) return res.status(401).send({message: 'Email or Password invalid'});
        
        const payload = {};
        const token = jwt.encode(payload, envVariables.tokenSecret);
    
        res.status(200).send({token: token});
    });
});

mongoose.connect(`mongodb://${envVariables.dbUser}:${envVariables.dbPassword}@ds135186.mlab.com:35186/mean-social-site`, {useMongoClient: true}, (err) => {
    if (!err) console.log('connected correctly');
});

app.listen(3000, () => {
    console.log('app running and listen localhost port 3000');
});