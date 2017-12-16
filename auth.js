const envVariables = require('./env/env.js'),
    User = require('./models/User.js'),
    bcrypt = require('bcrypt-nodejs'),
    jwt = require('jwt-simple'),
    express = require('express'),
    router = express.Router();

router.post('/register', (req, res) => {
    const userData = req.body;
    const user = new User(userData);

    user.save((err, newUser) => {
        if (err) return res.status(500).send({message: 'Error saving user'});
        
        createSendToken(res, newUser);
    });
});

router.post('/login', async (req, res) => {
    const loginData = req.body;
    const user = await User.findOne({email: loginData.email});

    if (!user) return res.status(401).send({message: 'Email or Password invalid'});

    bcrypt.compare(loginData.password, user.password, (err, isMatch) => {
        if (!isMatch) return res.status(401).send({message: 'Email or Password invalid'});
        
        createSendToken(res, user);
    });
});

function createSendToken(res, user) {
    const payload = { sub: user._id };
    const token = jwt.encode(payload, envVariables.tokenSecret);

    res.status(200).send({token: token});
}

const auth = {
    router,
    checkAuthenticated: (req, res, next) => {
        if (!req.header('authorization')) return res.status(401).send({message: 'Unauthorized. Missing Auth Header'});
        const token = req.header('authorization').split(' ')[1];
        const payload = jwt.decode(token, envVariables.tokenSecret);
    
        if (!payload) return res.status(401).send({message: 'Unauthorized. Auth Header Invalid'});
    
        req.userId = payload.sub;
    
        next();
    }
}

module.exports = auth;