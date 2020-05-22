// const mycron = require('node-cron').CronJob;
// const server = require('./server');
// const axios = require('axios');

// const getBirth = new mycron({
//     cronTime: '0 0 0 * * *',
//     onTick: function() {
//         let today = new Date();
//         let month = today.getMonth() + 1;
//         let day = today.getDate();
//         axios.get('/user').then((res) => {
//             res.forEach((doc) => {
//                 let birthmonth = doc.data().birthdaysplit('-') 
//                 if (month === birthmonth[1] && day === birthmonth[2]){
//                     const mes = '今日は' + doc.data().handle + 'さんの誕生日です！';
//                     server.sendPushMessage(mes);
//                 }
//             });
//         });
//     },
//     start: true,
// });

// getBirth.start();