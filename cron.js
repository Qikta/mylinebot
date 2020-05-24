const mycron = require('node-cron').CronJob;
const server = require('./server');
const axios = require('axios');

const getBirth = new mycron({
    cronTime: '*/1 * * * *',
    onTick: function() {
        let today = new Date();
        let month = today.getMonth() + 1;
        let day = today.getDate() + 1;
        server.sendPushMessage(`${month}-${day}`);
        // const res =  axios.get('https://asia-northeast1-birthday-api-ee69a.cloudfunctions.net/api/users');
        // const item = res.data;
        // item.map((doc) => {
        //     let birth = doc.data().birthday.split('-') ;
        //     if (month === birth[1] && day === birth[2]){
        //         const mes = '今日は' + doc.data().handle + 'さんの誕生日です！';
        //         server.sendPushMessage(mes);
        //     }
        // })
    },
    start: true,
});

getBirth.start();