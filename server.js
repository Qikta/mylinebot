'use strict';

const express = require('express');
const line = require('@line/bot-sdk');
const PORT = process.env.PORT || 3000;

const config = {
    channelSecret: 'c44f9f12eb6b9de9a4c74951e473917f',
    channelAccessToken: 'KkLNxQKm3QTNBSETm7sceZ4Gkfyq/nvWBWjSmtMpvhotT4oNEi5dHwwzqkzR7r9eyxcEKgCE+sEMTK2o7F6dSHJHlo5fN+R12EjK0mbKfWa5M61ieU06bhAIrpX6bdXqpZX1Lpyn+HhptZpkvNZQwQdB04t89/1O/w1cDnyilFU='
};

const app = express();

app.get('/', (req, res) => res.send('Hello LINE BOT!(GET)')); //ブラウザ確認用(無くても問題ない)
app.post('/webhook', line.middleware(config), (req, res) => {
    console.log(req.body.events);
    
    //ここのif分はdeveloper consoleの"接続確認"用なので削除して問題ないです。
    if(req.body.events[0].replyToken === '00000000000000000000000000000000' && req.body.events[1].replyToken === 'ffffffffffffffffffffffffffffffff'){
        res.send('Hello LINE BOT!(POST)');
        console.log('疎通確認用');
        return; 
    }

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
  if (evemt.message.text === 'こんにちは'){
      replyText = 'こんばんはの時間ですよ';
  } else {
      replyText = 'うざ';
  }

  return client.replyMessage(event.replyToken, {
    type: 'text',
    text: replyText
  });
}

// app.listen(PORT);
(process.env.NOW_REGION) ? module.exports = app : app.listen(PORT);
console.log(`Server running at ${PORT}`);