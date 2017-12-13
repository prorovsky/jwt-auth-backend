const envVariables = require('./env/env.js');
const express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var User = require('./models/User.js');
const Post = require('./models/Post.js');
var auth = require('./auth.js')

mongoose.Promise = Promise;

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

app.use(bodyParser.json());

app.get('/posts/:id', async (req, res) => {
    const author = req.params.id;
    const posts = await Post.find({author});
    res.send(posts);
});

app.post('/post', (req, res) => {
    const postData = req.body;
    postData.author = '5a3166e7d3c1762010cd7f31';

    const post = new Post(postData);

    post.save((err, result) => {
        if (err) {
            console.error('error when saving post');
            return res.status(500).send({message: 'saving post error'});
        }
        res.sendStatus(200);
    });
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

mongoose.connect(`mongodb://${envVariables.dbUser}:${envVariables.dbPassword}@ds135186.mlab.com:35186/mean-social-site`, {useMongoClient: true}, (err) => {
    if (!err) console.log('connected correctly');
});

app.use('/auth', auth);
app.listen(3000, () => {
    console.log('app running and listen localhost port 3000');
});