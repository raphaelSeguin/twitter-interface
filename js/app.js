'use strict';

// external libraries
const express = require('express');
const bodyParser = require('body-parser')
const Twit = require('twit');
// personnal lib
const lib = require('../lib/mylib');
// config file
const config = require('../config.js');
// expose mylib functions to global scope
lib.spawn(global);
// express app
const app = express();
const port = process.env.PORT || 5000;
// new client
const client = new Twit(config);
//
const user_id = config.access_token.split('-')[0];
//
const getUser = id => {
    // gets:
    // name
    // screen_name
    // profile pic

    return client.get('users/show', {user_id: id})
        .then( input => juice(input.data, ['name', 'screen_name', 'profile_image_url_https', 'profile_banner_url', 'friends_count']))
        .then( obj => Object.assign({}, {user: obj}))
        .catch( monitor('getUser error') )
};
const getTweets = () => {
    // gets:
    // -message content
    // -# of retweets
    // -# of likes
    // -date tweeted
    return client.get('statuses/user_timeline', {count: 5})
        .then( input => {
            return input.data.map( obj => juice(obj, ['text', 'favorite_count', 'retweet_count', 'created_at']));
        })
        .then( array => Object.assign({}, {tweets: array}))
        .catch( monitor('getTweets error') );
        ;
};
const getFriends = () => {
    // gets:
    // -profile image
    // -real name
    // -screenname
    return client.get('friends/list', {count: 5})
        .then( input => input.data.users.map( obj => juice(obj, ['name', 'screen_name', 'profile_image_url_https'])) )
        .then( array => Object.assign({}, {friends: array}))
        .catch( monitor('getUsers error') )
        ;
};
const getMessages = () => {
    // gets:
    // -message body
    // -date the message was sent
    // -time the message was sent
    return client.get('direct_messages/events/list', {count: 5})
        .then( obj => {
            return obj.data.events.map( obj => {
                console.log(obj.message_create)
                const response  = {};
                const timeStamp = new Date(parseInt(obj.created_timestamp));
                response.text   = obj.message_create.message_data.text;
                response.date   = timeStamp.toDateString();
                response.time   = timeStamp.toTimeString();
                response.timestamp = parseInt(obj.created_timestamp);
                response.fromMe = obj.message_create.sender_id === user_id;
                return response;
            });
        })
        .then( array => Object.assign({}, {messages: array}) )
        .catch( monitor('getMessages error') )
        ;
};
//
const getInfos = () => {
    return Promise.all([getUser(user_id), getTweets(), getFriends(), getMessages()])
        .then( arr => Object.assign({}, ...arr) )
        .then( monitor('\nINFOS:\n'))
        .catch( monitor("Sorry, I couldn't get your infos") )
        ;
};

app.set('view engine', 'pug');
app.set('views', './views');

app.use( express.static('public') );
app.use( bodyParser.urlencoded({extended: false}) );
// home page
app.get('/', (req, res, next) => {
    getInfos()
        .then(
            model => res.render('page.pug', model),
            err => next(err)
        )
});
// tweet API
app.post('/tweet', (req, res, next) => {
    // dirty hack to get the object's key
    let tweet = '';
    for ( let p in req.body ) {
        tweet = p;
    }
    client.post('statuses/update', { status: tweet })
        .then( infos => { res.render('singletweet.pug', infos.data); })
        .catch( err => console.log(err) )
})
// catch errors
app.use( (err, req, res, next) => {
    console.log(err);
    res.render('error.pug');
})
// server listens
app.listen(port, () => {
    console.log('\nlistening to port ' + port + '\n');
});
