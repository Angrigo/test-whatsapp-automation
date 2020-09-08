import { create, Client, Message,ev} from '@open-wa/wa-automate';
import express from "express";
import path from "path";
const fs = require('fs');

ev.on('qr.**', async qrcode => {
  //qrcode is base64 encoded qr code image
  //now you can do whatever you want with it
  const imageBuffer = Buffer.from(
    qrcode.replace('data:image/png;base64,', ''),
    'base64'
  );
  fs.writeFileSync('qr_code.png', imageBuffer);
});

const PORT = 4321;

function contains(target:any, pattern:any){
    var value = 0;
    pattern.forEach(function(word:any){
      value = value + target.includes(word);
    });
    return (value >= pattern.length)
}

var globalClient:Client;
var app: express.Application = express();

app.all("", function(req,res) {
    res.send("WA test");
})

app.listen(PORT, function () {
    console.log(`App is listening on port ${PORT}!`);
    });

create().then((client:Client) => start(client));

function start(client:Client) {
    globalClient = client;

  client.onAnyMessage( (message:Message) => {
    if (contains(message.body.toUpperCase(), ["CHE","ORE", "SONO", "?"])) {
        if(!message.isGroupMsg){
              client.sendText(message.from, 'Sono le '+new Date().toLocaleTimeString());
        }
    }
  });
}

app.all("/chats", async function(req,res) {
    res.send(await globalClient.getAllChats());
})

app.all("/chatIds", async function(req,res) {
    res.send(await globalClient.getAllChatIds());
})

app.all("/qrCode", async function(req,res) {
  res.set({'Content-Type': 'image/png'});
  res.sendFile(path.resolve("./qr_code.png"))
})
