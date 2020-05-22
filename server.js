'use strict';

const express = require('express');
// const cron = require('./cron');
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

async function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    return Promise.resolve(null);
  }

  let replyText = '';
  if (event.message.text === '誕生日'){
    replyText = 'ちょっとまってね'; //待ってねってメッセージだけ先に処理
    getUsers(event.source.userId);
  } else {
    replyText = event.message.text;
  }

  return client.replyMessage(event.replyToken, {
    type: 'text',
    text: replyText
  });
}

const getUsers = (userId) => {
  const message = [];
  axios.get('/users').then((res) => {
    res.forEach((doc) => {
      handle = doc.data().handle;
      birth = doc.data().birthday;
      message.push({
        type : 'text',
        text : `${handle}さん：${birth}`
      });
    })
    .catch(err => console.log(err));
  })
  // let message = [];
  // res.forEach((doc) => {
  //   handle = doc.data().handle;
  //   birth = doc.data().birthday;
  //   message.push({
  //     type : 'text',
  //     text : `${handle}さん：${birth}`
  //   });
  // });

  return client.pushMessage(userId, message);
}

// app.listen(PORT);
(process.env.NOW_REGION) ? module.exports = app : app.listen(PORT);
console.log(`Server running at ${PORT}`);