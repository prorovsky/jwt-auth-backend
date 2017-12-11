var express = require('express');
var app = express();
var bodyParser = require('body-parser');

const posts = [
    {message: 'hello'},
    {message: 'hi'}
];

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(bodyParser.json());

app.get('/posts', (req, res) => {
    res.send(posts);
});

app.post('/register', (req, res) => {
    const userData = req.body;
    console.log(userData.email);
    res.sendStatus(200);
});

app.listen(3000, () => {
    console.log('app running and listen localhost port 3000');
});