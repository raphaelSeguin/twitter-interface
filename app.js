'use strict';

// libs
const express = require('express');
const Twitter = require('twitter');
// config file
const config = require('./config.js');
const lib = require('./lib/mylib');
// expose mylib functions to global scope
lib.spawn(global);
// express app
const app = express();
const port = process.env.PORT || 5000;

const client = new Twitter(config);
//monitor('config')(config);

const getInfos = () => {
    //
    const getUser = () => {
        // gets:
        // name
        // screen_name
        // profile pic
        return client.get('users/show', {user_id: config.user_id})
            .then( input => juice(input, ['name', 'screen_name', 'profile_image_url_https']))
            .then( obj => Object.assign({}, {user: obj}))
            .catch( monitor('getUser error') )
    };
    const getTweets = () => {
        // gets:
        // -message content
        // -# of retweets
        // -# of likes
        // -date tweeted
        return client.get('statuses/home_timeline', {count: 5})
            .then( input => {
                return input.map( obj => juice(obj, ['text', 'favorite_count', 'retweet_count', 'created_at']));
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
            .then( input => input.users.map( obj => juice(obj, ['name', 'screen_name', 'profile_image_url_https'])) )
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
                return obj.events.map( obj => {
                    const response  = {};
                    const timeStamp = new Date(parseInt(obj.created_timestamp));
                    response.text   = obj.message_create.message_data.text;
                    response.date   = timeStamp.toDateString();
                    response.time   = timeStamp.toTimeString();
                    return response;
                });
            })
            .then( array => Object.assign({}, {messages: array}))
            .catch( monitor('getMessages error') )
            ;
    };
    return Promise.all([getUser(), getTweets(), getFriends(), getMessages()])
        .then( arr => Object.assign({}, ...arr) )
        .catch( monitor("Sorry, I couldn't get your infos") )
        ;
};

app.set('view engine', 'pug');
app.set('views', './views');

app.use(express.static('public'));

app.get('/', (req, res) => {
    getInfos()
        .then( monitor('infos') )
        .then( obj => res.render('page.pug', obj) )
        .catch( monitor('error') );
});

app.listen(port, () => {
    console.log('\nlistening to port ' + port + '\n');
});
