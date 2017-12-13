const envVariables = require('./env/env.js');
var User = require('./models/User.js');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('jwt-simple');
const express = require('express');
const router = express.Router();

router.post('/register', (req, res) => {
    const userData = req.body;
    const user = new User(userData);

    user.save((err, result) => {
        if (err) console.error('error when saving user');
        res.sendStatus(200);
    });
});

router.post('/login', async (req, res) => {
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

module.exports = router;