const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require('fs');
const gm = require('gm');
const token = 'MzM5NDE2MDI1ODgxNzcyMDMy.DGCmtw.xTlgAi_xl-9O5k62GXQmLi-brLs';

var timerId;

var admins = ['Daniel#6536', 'testing#6131'];
var voice_channel = '💬 General';
var text_channel = 'chat';
var guild_name = 'Метаконференция';

function send_score(score_arr){
  if (score_arr[0] > score_arr[1]) {
    gm(300, 300, 'rgb(15, 100, 250)')
    .fill('rgb(255, 255, 255)')
    .drawRectangle(150, 0, 300, 300)
    .font('./resources/chgk/OpenSans-Bold.ttf', 225)
    .drawText(10, 225, score_arr[0])
    .fill('rgb(15, 100, 250)')
    .drawText(162, 225, score_arr[1])
    .write('./resources/chgk/score.png', function() {
      text_channel.send(undefined, {files: ['./resources/chgk/score.png']});
    });
  } else {
    gm(300, 300, 'rgb(255, 255, 255)')
    .fill('rgb(15, 100, 250)')
    .drawRectangle(150, 0, 300, 300)
    .font('./resources/chgk/OpenSans-Bold.ttf', 225)
    .drawText(10, 225, score_arr[0])
    .fill('rgb(255, 255, 255)')
    .drawText(162, 225, score_arr[1])
    .write('./resources/chgk/score.png', function() {
      text_channel.send(undefined, {files: ['./resources/chgk/score.png']});
    });
  }
}

client.on('ready', () => {
  voice_channel = client.guilds.find('name', guild_name).channels.find(channel => channel.name == voice_channel && channel.type == 'voice')
  text_channel = client.guilds.find('name', guild_name).channels.find(channel => channel.name == text_channel && channel.type == 'text')
});

client.on('message', message => {
  if (message.channel.type != 'dm') { return; }
  if (admins.indexOf(message.author.tag) == -1) { return; }

  voice_channel.join().then(connection => {
    if (/^(?:5)$/.test(message.content)) {
      text_channel.send(undefined, {files: ['./resources/chgk/WhatWhereWhen.png']})
        const dispatcher = connection.playFile('./resources/chgk/nachalo.mp3');
        dispatcher.on("end", end => {
          connection.playFile('./resources/chgk/Thus_Sprach_Zarathustra.mp3');
        });
    } else if (/^(?:1)$/.test(message.content)) {
      text_channel.send(undefined, {files: ['./resources/chgk/ruletka.jpg']})
      connection.playFile('./resources/chgk/Volchok.mp3');
    } else if (/^(?:2)$/.test(message.content)) {
      connection.playFile('./resources/chgk/gong.mp3');
    } else if (/^(?:3)$/.test(message.content)) {
      const dispatcher = connection.playFile('./resources/chgk/Signal_2.mp3');
      dispatcher.on("end", end => {
        timerId = setTimeout(function() {
          const dispatcher2 = connection.playFile('./resources/chgk/Signal_1.mp3');
          dispatcher2.on("end", end => {
            timerId = setTimeout(function() {
              connection.playFile('./resources/chgk/Signal_2.mp3');
            }, 10 * 1000);
          });
        }, 80 * 1000);
      });
    } else if (/^(?:[0-6]{2})$/.test(message.content)) {
      let score_arr = message.content.split('');
      if (score_arr[0] == 6) {
        fs.readdir('./resources/chgk/win/', (error, files) => {
          let img = files[Math.floor(Math.random()*files.length)];
          text_channel.send(`**Победила команда знатоков со счетом ${score_arr[0]}:${score_arr[1]}!**`, {files: [`./resources/chgk/win/${img}`]});
          send_score(score_arr);
          connection.playFile('./resources/chgk/Dance_Macabre.mp3');
        });
      } else if (score_arr[1] == 6) {
        fs.readdir('./resources/chgk/lose/', (error, files) => {
          let img = files[Math.floor(Math.random()*files.length)];
          text_channel.send(`**Победила команда телезрителей со счетом ${score_arr[0]}:${score_arr[1]}!**`, {files: [`./resources/chgk/lose/${img}`]});
          send_score(score_arr);
          connection.playFile('./resources/chgk/Dance_Macabre.mp3');
        });
      } else {
        fs.readdir('./resources/chgk/music/', (error, files) => {
          let mus = files[Math.floor(Math.random()*files.length)];
          send_score(score_arr);
          connection.playFile(`./resources/chgk/music/${mus}`);
        });
      }
    } else if (/^(?:ё|`)$/.test(message.content)) {
      connection.disconnect();
      clearTimeout(timerId);
    }
  }).catch(err => console.log(err));
});

client.login(token);
