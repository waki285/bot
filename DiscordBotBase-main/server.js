const http = require("http");
const querystring = require("querystring");
const discord = require("discord.js");
const client = new discord.Client();
try {
  // GAS(Google Apps Script)からの受信(botの常時起動)
  http.createServer(function(req, res){
   if (req.method == 'POST'){
     var data = "";
     req.on('data', function(chunk){
       data += chunk;
     });
     req.on('end', function(){
       if(!data){
         res.end("No post data");
         return;
       }
       var dataObject = querystring.parse(data);
       console.log("post:" + dataObject.type);
       if(dataObject.type == "wake"){
         console.log("Woke up in post");
         res.end();
         return;
       }
       res.end();
     });
   }
   else if (req.method == 'GET'){
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Discord Bot is active now\n');
   }
  }).listen(3000);
  client.on("ready", message => {
    console.log("Bot準備完了～");
    client.user.setActivity(process.env.activity, { type: process.env.acttype }); 
  });

  client.on("message", message => {
    if (message.author.id == client.user.id || message.author.bot) return;
    if (message.mentions.has(client.user)) {
      message.reply("呼びましたか?");
    }
    if (message.content == process.env.prefix + "help") {
      message.channel.send({
        embed: {
          title: "ヘルプ",
          description: "全てのコマンドの初めに`" + process.env.prefix + "`をつける必要があります。",
          fields: [
            {
              name: "ヘルプ",
              value: "`help`"
            }
          ]
        }
      });
    }
  });

  if (process.env.DISCORD_BOT_TOKEN == undefined) {
    console.log("DISCORD_BOT_TOKENが設定されていません。");
    process.exit(0);
  }

  client.login(process.env.DISCORD_BOT_TOKEN);
} catch (err) {
  console.log(err);
}
