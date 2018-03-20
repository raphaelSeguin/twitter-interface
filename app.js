'use strict';

const express = require('express');
const infos = require('./config.js');

const app = express();
const port = process.env.PORT || 5000;

app.set('view engine', 'pug');
app.set('views', './views');

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.render('hello.pug');
});

app.listen(port, () => {
    console.log('listening to port ' + port);
});

// const id = 38893840;
// const urls = {
//     authentication: 'https://api.twitter.com/oauth2/token',
//     requestToken: 'https://api.twitter.com/oauth/request_token',
//     authorize: 'https://api.twitter.com/oauth/authorize',
//     accessToken: 'https://api.twitter.com/oauth/access_token'
// }
