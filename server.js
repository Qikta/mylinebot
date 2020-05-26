'use strict';

const express = require('express');
const line = require('@line/bot-sdk');
const PORT = process.env.PORT || 3000;
const axios = require('axios');

const config = {
    channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
    channelSecret: process.env.CHANNEL_SECRET
};

const app = express();

app.post('/webhook', line.middleware(config), (req, res) => {
    console.log(req.body.events);

    Promise
      .all(req.body.events.map(handleEvent))
      .then((result) => res.json(result));
});

const client = new line.Client(config);

function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    return Promise.resolve(null);
  }

  let replyText = '';
  const res = await axios.get('https://asia-northeast1-birthday-api-ee69a.cloudfunctions.net/api/users');
  const item = res.data;
  item.map((doc) => {
    const handle = doc.handle;
    const lastname = doc.lastname;
    const birth = doc.birthday;
    if (event.message.text === handle || event.message.text === lastname){
      replyText = `${handle}の誕生日は${birth}`
    }
  });

  if (event.message.text === ''){
    replyText = event.message.text;
  } 

  return client.replyMessage(event.replyToken, {
    type: 'text',
    text: replyText
  });
}

// app.listen(PORT);
(process.env.NOW_REGION) ? module.exports = app : app.listen(PORT);
console.log(`Server running at ${PORT}`);