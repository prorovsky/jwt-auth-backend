const envVariables = require('./env/env.js'),
    express = require('express'),
    app = express(),
    jwt = require('jwt-simple'),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    User = require('./models/User.js'),
    Post = require('./models/Post.js'),
    auth = require('./auth.js');

mongoose.Promise = Promise;

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Authorization, Content-Type, Accept');
    next();
});

app.use(bodyParser.json());

app.get('/posts/:id', async (req, res) => {
    const author = req.params.id;
    const posts = await Post.find({author});
    res.send(posts);
});

app.post('/post', auth.checkAuthenticated, (req, res) => {
    const postData = req.body;
    postData.author = req.userId;

    const post = new Post(postData);

    post.save((err, result) => {
        if (err) {
            console.error('error when saving post');
            return res.status(500).send({message: 'saving post error'});
        }
        res.status(200).send({message: 'yes you posted new post'});
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

app.use('/auth', auth.router);
app.listen(process.env.PORT || 3000, () => {
    console.log('app running and listen localhost port 3000');
});