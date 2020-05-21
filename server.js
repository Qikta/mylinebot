'use strict';

const express = require('express');
const axios = require('axios');
const line = require('@line/bot-sdk');
const PORT = process.env.PORT || 3000;

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
  if (event.message.text === 'qiita'){
    replyText = 'ちょっとまってね'; //待ってねってメッセージだけ先に処理
    getQiita(event.source.userId); //スクレイピング処理が終わったらプッシュメッセージ
  } else {
    replyText = event.message.text;
  }

  return client.replyMessage(event.replyToken, {
    type: 'text',
    text: replyText
  });
}

const getQiita = async(userId) => {
    const res = await axios.get('http://qiita.com/api/v2/items?page=1&per_page=10');
    const article = [];
    res.data().forEach((doc) => {
        article.push(doc.url);
    });
    return client.pushMessage(userId, {
        type: 'text',
        text: article[0],
    });
};

// app.listen(PORT);
(process.env.NOW_REGION) ? module.exports = app : app.listen(PORT);
console.log(`Server running at ${PORT}`);