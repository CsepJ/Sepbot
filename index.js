const { Client, MessageEmbed, MessageFlags, MessageAttachment, MessageCollector, Message, APIMessage, Intents } = require('discord.js');
const request = require("request");
const Database = require("@replit/database");
const db = new Database();
const config = require('./config');
const keepAlive = require("./server.js");
const help = require("./cmd.js");
const version = config.version;
const Quiz = require('./quiz/quiz');
const { prefix } = require('./config');
const quiz_cmd = require("./quiz/quiz-cmd.js");
const filtering = require("./filter");
const fs = require("fs");
const quiz = new Quiz(db);
const bot = new Client({
  "presence" : {
    "activity" : {
      "type" : "LISTENING",
      "name" : "Sepbot is running"
    }
  },
  intents: [
    Intents.FLAGS.GUILDS, 
    Intents.FLAGS.GUILD_MEMBERS, 
    Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS, 
    Intents.FLAGS.GUILD_INTEGRATIONS, 
    Intents.FLAGS.GUILD_INVITES, 
    Intents.FLAGS.GUILD_PRESENCES, 
    Intents.FLAGS.GUILD_MESSAGES, 
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS, 
    Intents.FLAGS.DIRECT_MESSAGES, 
    Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
    Intents.FLAGS.DIRECT_MESSAGE_TYPING
    ]
});
function translator(from, to, msg){
  let options = {
    url : "https://openapi.naver.com/v1/papago/n2mt",
    headers: {
      'X-Naver-Client-Id': 'QEC1ffdCU9YChnp8sJVx',
      'X-Naver-Client-Secret': 'dVRhNnUFvu'
    },
    form: {
      'source': from,
      'target': to,
      'text': msg
   },
   json: true
}
return options;
}
bot.on('ready', async () => {
    console.log("Sepbot is running");
});
bot.on("guildCreate", (guild) => {
    const welcomeEmbed = new MessageEmbed()
    .setColor("#F44444")
    .setTitle("안녕하세요 셉봇입니다")
    .setDescription(`도움말: ${config.prefix}명령어`);
    guild.systemChannel.send({embeds: [welcomeEmbed]});
});
bot.on('messageCreate', async message => {
  try{
  if(message.author.bot) return;
  const msg = message.content;
  const channelID = String(message.channel.id);
  const userID=message.author.id;
  if(msg.startsWith(`${prefix}이름 `)){
    var name=filtering.filter(msg.slice(prefix.length+3));
    var setting = await quiz.setName(userID, filtering.filter(name));
    if(setting.isSign){
      message.react("☑️");
      message.channel.send(name+"(으)로 이름을 바꾸셨습니다");
    }else{
      message.channel.send(quiz.error[0]);
    }
  }
  if(msg.startsWith(`${prefix}번역 `)){
    var value = msg.slice(prefix.length+3);
    let translateOption = translator("ko","en", value);
    request.post(translateOption, (err,res,body) => {
      if(err) throw err;
      let translateResult = body["message"]["result"]["translatedText"];
    let translateEmbed = new MessageEmbed()
    .setTitle("단어 번역")
    .setColor("#F44444")
    .addFields({
      "name" : "**> "+value+"**", "value" : "한국어(Korean)", "inline" : false
    },{
      "name" : "**> "+translateResult+"**", "value" : "영어(English)", "inline" : false
    })
    .setTimestamp();
    message.channel.send({embeds: [translateEmbed]});
  });
  }
  if(msg.startsWith(`${prefix} 번역 `)){
  var value = msg.slice(prefix.length+3);
  let translateOption = translator("en","ko", value);
  request.post(translateOption, (err,res,body) => {
    if(err) throw err;
    let translateResult = body["message"]["result"]["translatedText"];
  let translateEmbed = new MessageEmbed()
  .setTitle("Translating Word")
  .setColor("#F44444")
  .addFields({
    "name" : "**> "+value+"**", "value" : "영어(English)", "inline" : false
  },{
    "name" : "**> "+translateResult+"**", "value" : "한국어(Korean)", "inline" : false
  })
  .setTimestamp();
  message.channel.send({embeds: [translateEmbed]});
});
}
  if(msg.startsWith(`${prefix}설정 `)){
    var num = msg.slice(prefix.length+3)
    if(isNaN(num)){
      message.channel.send("값이 숫자가 아닙니다!\n\n예시 : "+prefix+"칭호 1");
    }else{
      var result = await quiz.setRank(userID, num-1);
      if(result["bool"]){
        message.react("☑️");
        var setRankEmbed = new MessageEmbed()
        .setTitle("**"+result.result.name+"**")
        .setThumbnail(result.result.image)
        .setColor("#F44444")
        .setDescription("To."+result.result.name)
        .setTimestamp();
        message.channel.send({embeds: [setRankEmbed]});
      }else{
        message.channel.send(result.reason);
      }
    }
  }
  if(msg.startsWith("S") || msg.startsWith("s")){
    var answerMsg = msg.slice(1);
    var isAnswer = await quiz.isAnswer(channelID, answerMsg);
    var user = await quiz.getUser(userID);
    var isSign = user["isSign"];
    if(isAnswer["isPlaying"]){
      if(isAnswer["result"]["bool"]){
        if(isSign){
        var random = Math.floor(Math.random() * 20)+1;
        var add = await quiz.add(userID, "point", random);
        var correctEmbed = new MessageEmbed()
        .setTitle("***[ "+add.result.rankname+" ] "+add.result.name+"님이 맞추셨습니다***")
        .setColor("F44444")
        .setThumbnail(add.result.rankimage)
        .setDescription("__"+add.result.point+"점이 되셨습니다.__")
        .addField("얻은 포인트", `+${random}점`)
        .setURL("https://sepcod.com");
        message.channel.send({embeds: [correctEmbed]});
        }else{
          console.log("Quiz Error 0")
          message.channel.send(quiz.error[0]);
        }
      }else{
        if(isAnswer["result"]["correct"]!=null){
          message.channel.send(message.author.username+"님, "+isAnswer["result"]["correct"]["length"]+"개 ("+isAnswer["result"]["correct"]["percentage"]+"%) 맞았습니다.")
        }else{
          console.log("IsAnswer reason");
          message.channel.send(isAnswer["reason"]);
        }
      }
    }
  }
  if (msg.startsWith(config.prefix)) {
    let command = msg.slice(config.prefix.length);
    //startsWith cmd
    switch (command) {
      case "":
        let Embed = new MessageEmbed()
        .setAuthor("Sepbot", "https://imgur.com/SF3ulIX.png")
        .setTitle("안녕하세요, 셉봇입니다.")
        .setDescription(`사용방법: ${config.prefix}명령어`)
        .setColor("#F44444")
        .setFooter(`Ver-${version}`);
        message.channel.send({embeds: [Embed]});
        break;
      case "명령어":
      case "도움말":
      case "help":
      case "도움":
      case "명령":
      case "도와줘":
        let cmdEmbed = new MessageEmbed()
        .setTitle("셉봇 명령어 리스트")
        .setColor("#F44444");
        for(let i = 0; i < help.length;i++){
          cmdEmbed.addFields(
            {
              name : `> **${help[i]["cmd"]}**`, value : help[i]["description"], inline : false
            }
          )
        }
        message.channel.send({embeds: [cmdEmbed]});
        break;
      case "내역":
      case "로그":
      case "업데이트":
          let logEmbed = new MessageEmbed()
          .setColor("#F44444")
          .setTitle("셉봇의 업데이트 내역")
          .addField("> 업데이트 "+version, "데이터베이스 수정", false)
          .setTimestamp()
          .setFooter("버전 : "+version);
          message.channel.send({embeds: [logEmbed]});
          break;
      case "퀴즈":
        let QuizCmdEmbed = new MessageEmbed()
        .setColor("#F44444")
        .setTitle("퀴즈 명령어 목록")
        .setDescription("Quiz Commands")
        .addFields(quiz_cmd);
        message.channel.send({embeds: [QuizCmdEmbed]});
      break;
      case "hellothisisverification":
        let devProfile = "SepJ#0359";
        message.channel.send(devProfile);
        break;
      case "가입":
        var signup = await quiz.signUp(userID, message.author.username);
        if(signup["isSign"] == true){
          message.channel.send(signup.reason);
        }else{
          message.react("☑️");
          let signupEmbed = new MessageEmbed()
          .setColor("F44444")
          .setTimestamp()
          .setTitle("성공적으로 가입을 했습니다!")
          .setDescription(`이제 "${prefix}퀴즈" 명령어로 시작해보세요!`)
          .setURL("https://sepcod.com");
          message.channel.send({embeds: [signupEmbed]});
        }
      break;
      case "초성":
      let setWord = await quiz.setWord(channelID);
        var wordEmbed = new MessageEmbed()
        .setTitle(setWord["getWord"]==true?"초성퀴즈 진행중!":"초성퀴즈 시작!")
        .setDescription("S[답] 혹은 s[답]으로 답을 맞추시면 됩니다.")
        .addFields({
          name : setWord["result"]["quiz"], value : "종류 : "+setWord["result"]["type"], inline : true
        })
        .setColor("F44444")
        .setURL("https://sepcod.com");
        message.channel.send({embeds: [wordEmbed]});
      break;
      case "힌트":
        let hint = await quiz.hint(channelID);
        if(hint.isPlaying){
          let hintEmbed = new MessageEmbed()
          .setTitle("초성퀴즈 힌트")
          .setDescription("힌트 : "+hint.result)
          .setColor("F44444");
          message.channel.send({embeds: [hintEmbed]});
        }else{
          message.channel.send(hint.reason);
        }
      break;
      case "패스":
        let pass = await quiz.pass(channelID);
        if(pass.isPlaying){
          let passEmbed = new MessageEmbed()
          .setTitle("초성퀴즈 패스")
          .setDescription("정답 : "+pass.result)
          .setColor("F44444");
          message.channel.send({embeds: [passEmbed]});
        }else{
          message.channel.send(pass.reason);
        }
      break;
      case "정보":
        var user = await quiz.getUser(userID);
        if(user["isSign"]){
        var userData = user["user-object-0"];
        let statusEmbed = new MessageEmbed()
        .setTitle("[ "+userData.rankname+" ] "+userData.name)
        .addField(userData.name, userData.rankname)
        .setDescription("Point : "+userData.point)
        .setColor("F44444")
        .setThumbnail(userData.rankimage)
        .setURL(userData.rankimage)
        .setFooter("To. "+userData.name)
        .setTimestamp();
        message.channel.send({embeds: [statusEmbed]});
        }else{
          message.channel.send(quiz.error[0]);
        }
      break;
      case "랭크":
      case "랭킹":
        var ranking = await quiz.getRank(userID);
        if(ranking["isSign"]==true){
          var rank = ranking.result.rank.map((e,i) => {
            if(i < 3){
              return (i+1)+"등 : [ "+e.rankname+" ] "+e.name+" | "+e.point
            }else{
              return (ranking["result"]["index"]+(i-4))+"등 : [ "+e.rankname+" ] "+e.name+" | "+e.point;
            }
          });
          message.channel.send(rank.join("\n===============\n"));
        }else{
          message.channel.send(ranking.reason);
        }
      break;
      case "칭호":
        var rankname = quiz.ranknames;
        var rankpoint = quiz.conditions;
        var result = rankname.map((e,i) => {
          return "**"+(i+1)+"번**  | "+e+" | "+rankpoint[i]+"점";
        });
        message.channel.send("DM으로 전송되었습니다")
        .then(msg => {
          msg.delete({timeout : 5000});
        }).catch(e => console.log("Error in Shop\n\n"+e));
        message.author.send(result.join("\n===============\n"));
      break;
    }  //switch
  }
  }catch(e){
    console.log(e);
  } 
});
keepAlive();
bot.login(config.token);