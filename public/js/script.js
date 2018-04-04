'use strict';

const messageForm = document.getElementsByTagName('form')[0];
const messageText = document.getElementById('tweet-textarea');
const tweetList = document.getElementsByClassName('app--tweet--list')[0];
const url = `${window.location.toString().slice(0, -1)}/tweet`;

const sendTweet = text => {
    const req = new XMLHttpRequest();
    req.open('POST', url );
    req.onreadystatechange = function() {
        if ( req.readyState === 4) {
            displayTweet(req.responseText);
        }
    };
    req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    req.send(text);
}
const displayTweet = html => {
    tweetList.lastChild.remove();
    tweetList.insertAdjacentHTML('afterbegin', html)
    messageText.value = '';
}

messageForm.addEventListener('submit', event => {
    event.preventDefault();
    sendTweet(messageText.value);
})
