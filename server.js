'use strict';

const express = require('express');
const cron = require('node-cron');
const line = require('@line/bot-sdk');
const PORT = process.env.PORT || 3000;
const axios = require('axios');
const moment = require('moment-timezone');

const config = {
    channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
    channelSecret: process.env.CHANNEL_SECRET
};

const myId = 'U4f4bab656c77a917dd399292896391ee';

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
  if (event.message.text === '誕生日'){
    replyText = 'ちょっとまってね'; 
    getUsers(event.source.userId);
  } else {
    replyText = event.message.text;
  }

  return client.replyMessage(event.replyToken, {
    type: 'text',
    text: replyText
  });
}

cron.schedule('*/1 * * * *', () => {
  let today = new Date();
  let month = today.getMonth() + 1;
  let day = today.getDate() + 1;
  client.pushMessage(myId, {
    type: "text",
    text: `${month}-${day}`
  })
  console.log(moment().tz("Asia/Tokyo").format() + ' 送信完了：push message');
})

const getUsers = async(userId) => {
  const res = await axios.get('https://asia-northeast1-birthday-api-ee69a.cloudfunctions.net/api/users');
  const item = res.data;
  let messages = [];
  item.map((doc) => {
    const handle = doc.handle;
    const birth = doc.birthday;
    messages.push({
      type : 'text',
      text : `${handle}さん：${birth}`
    });
  });

  return client.pushMessage(userId, messages[0]);
}

// app.listen(PORT);
(process.env.NOW_REGION) ? module.exports = app : app.listen(PORT);
console.log(`Server running at ${PORT}`);