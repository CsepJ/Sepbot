const { Client, MessageActionRow, 
  MessageButton, MessageSelectMenu, 
  MessageEmbed, MessageFlags, 
  MessageAttachment, MessageCollector, 
  Intents } = require('discord.js');
const axios = require("axios").default;
const Database = require("@replit/database");
const db = new Database();
const config = require('./config');
const keepAlive = require("./server");
const help = require("./cmd");
const version = config.version;
const wait = require("util").promisify(setTimeout);
const Quiz = require('./quiz/quiz');
const { prefix } = require('./config');
const quiz_cmd = require("./quiz/quiz-cmd");
const filtering = require("./filter");
const dateFormat = require("./date-format");
const fs = require("fs");
const quiz = new Quiz(db);
const bot = new Client({
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
async function translator(from, to, msg){
let postData = await axios.post("https://openapi.naver.com/v1/papago/n2mt",{
  'source': from,
  'target': to,
  'text': msg
},{
  headers: {
    'X-Naver-Client-Id': config.naverid,
    'X-Naver-Client-Secret': config.naverpw
  }
});
return postData.data.message.result.translatedText;
}
bot.on('ready', async () => {
  bot.user.setPresence({activities: [{name: "Sepbot is running", type: "LISTENING"}]});
  let commands = [
    {
    name: "명령어",
    description: "사용방법을 알려줍니다"
  },{
    name: "정답",
    description: "초성퀴즈 정답을 제출합니다",
    options: [{
      name: "정답",
      description: "제출할 정답",
      type: "STRING",
      required: true
    }]
  },{
    name: "이름",
    description: "초성퀴즈 사용자이름을 바꿉니다",
    options:[{
      name: "바꿀이름",
      description: "바꾸고 싶은 이름",
      type: "STRING",
      required: true
  }]
},{
    name: "설정",
    description: "칭호를 설정합니다"
  },{
    name: "한국어",
    description: "한국어 => 영어로 번역합니다",
    options: [{
      name: "한국어",
      description: "영어로 번역할 단어",
      type: "STRING",
      required: true
    }]
  },{
    name: "영어",
    description: "영어 => 한국어로 번역합니다",
    options: [{
      name: "영어",
      description: "한국어로 번역할 단어",
      type: "STRING",
      required: true
    }]
	}];
  await bot.application?.commands.set(commands);
    console.log("Sepbot is running\n----------\nNode-Version: "+process.version+"\nBot-Name: "+bot.user.username+"\nBot-ID: "+bot.user.id+"\n==========\nBot-Version: "+config.version+"\nBot-Servers: "+bot.guilds.cache.size+"개");
});
bot.on("interactionCreate",async inter => {
  if(inter.isSelectMenu()){
    if(inter.customId === "Nickname"){
      let userID = inter.user.id;
      var num = quiz.ranknames.findIndex(e => e == inter.values[0]);
        var result = await quiz.setRank(userID, num);
        if(result["bool"]){
          var setRankEmbed = new MessageEmbed()
          .setTitle("**"+result.result.name+"**")
          .setThumbnail(result.result.image)
          .setColor("#F44444")
					.setDescription(`To. ${inter.user.username}`)
          .setTimestamp();
          await inter.update({embeds: [setRankEmbed]});
        }else{
          await inter.update(`${inter.user.username}님 ${result.reason}`);
        }
    }
  }
  if(inter.isCommand()){
    let { commandName, options, channelId } = inter;
    if(commandName === "명령어"){
      let cmdEmbed = new MessageEmbed()
      .setTitle("셉봇 명령어 리스트")
      .setColor("#F44444")
      .setFooter("∴[단어] 는 변형해서 입력해주세요∴");
      for(let i = 0; i < help.length;i++){
        cmdEmbed.addFields(
          {
            name : `> **__${help[i]["cmd"]}__**`, value : help[i]["description"], inline : false
          }
        )
      }
      await inter.reply({embeds : [cmdEmbed]});
    }else if(commandName === "정답"){
			let userID = inter.user.id;
      var answerMsg = options.getString("정답");
      var isAnswer = await quiz.isAnswer(channelId, answerMsg);
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
          .addField("얻은 포인트", `+${random}점`);
          await inter.reply({embeds: [correctEmbed]});
          }else{
            await inter.reply(quiz.error[0]);
          }
        }else{
          if(isAnswer["result"]["correct"]!=null){
            await inter.reply( inter.user.username+"님, "+isAnswer["result"]["correct"]["length"]+"개 ("+isAnswer["result"]["correct"]["percentage"]+"%) 맞았습니다.")
          }else{
            await inter.reply(isAnswer["reason"]);
          }
        }
      }
    }else if(commandName == "설정"){
      let nicknames = quiz.ranknames;
      let nickmenus = nicknames.map((e,i) => {
        return {
          label: e,
          description: "칭호: "+e,
          value: e
        }
      });
      let setNickname = new MessageActionRow()
      .addComponents(
        new MessageSelectMenu()
        .setCustomId("Nickname")
        .setPlaceholder("칭호 없음")
        .addOptions(nickmenus)
      );
      let setNicknameEmbed = new MessageEmbed()
      .setTitle("칭호를 설정해주세요")
      .setDescription("아래 메뉴바에서 칭호를 설정해주세요")
      .setColor("F44444")
      .setTimestamp();
      await inter.reply({embeds: [setNicknameEmbed], components: [setNickname]});
    }else if(commandName == "한국어"){
      var value = options.getString("한국어").length>=100?options.getString("한국어").substring(0,100):options.getString("한국어");
      var translate = await translator("ko","en", value);
      let translateEmbed = new MessageEmbed()
      .setTitle("번역")
      .setColor("#0ff193")
      .addFields({
        "name" : "**> "+value+"**", "value" : "한국어(Korean)", "inline" : false
      },{
        "name" : "**> "+translate+"**", "value" : "영어(English)", "inline" : false
      })
      .setTimestamp();
      await inter.reply({embeds: [translateEmbed]});
    }else if(commandName == "영어"){
      var value = options.getString("영어").length>=100?options.getString("영어").substring(0,100):options.getString("영어");
      var translate = await translator("en","ko", value);
      let translateEmbed = new MessageEmbed()
      .setTitle("Translation")
      .setColor("#0ff193")
      .addFields({
        "name" : "**> "+value+"**", "value" : "영어(English)", "inline" : false
      },{
        "name" : "**> "+translate+"**", "value" : "한국어(Korean)", "inline" : false
			})
      .setTimestamp();
      await inter.reply({embeds: [translateEmbed]});
    }else if(commandName == "이름"){
			let userID = inter.user.id;
      var name=filtering.filter(options.getString("바꿀이름"));
      var setting = await quiz.setName(userID, name);
      if(setting.isSign){
        await inter.reply(name+"(으)로 이름을 바꾸셨습니다");
      }else{
        await inter.reply(quiz.error[0]);
      }
    }
  }
});
bot.on("guildCreate", (guild) => {
  if(guild.me.permissions.has("SEND_MESSAGES")){
		if(guild.systemChannel){
    const welcomeEmbed = new MessageEmbed()
    .setColor("GOLD")
    .setTitle("안녕하세요 셉봇입니다")
    .setDescription(`도움말: ${config.prefix}명령어`);
    guild.systemChannel.send({embeds: [welcomeEmbed]});
		}
  }
});
bot.on('messageCreate', async message => {
  try{
  if(message.author.bot) return;
  const msg = message.content;
  const channelID = message.channel.id;
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
  if(msg.startsWith("S") || msg.startsWith("s")){
    var answerMsg = msg.slice(1);
    var isAnswer = await quiz.isAnswer(channelID, answerMsg);
    var user = await quiz.getUser(userID);
    var isSign = user["isSign"];
    if(isAnswer["isPlaying"]){
      if(isAnswer["result"]["bool"]){
        if(isSign){
        var random = isAnswer["result"]["correct"]["length"];
        var add = await quiz.add(userID, "point", random);
        var correctEmbed = new MessageEmbed()
        .setTitle("***[ "+add.result.rankname+" ] "+add.result.name+"님이 맞추셨습니다***")
        .setColor("F44444")
        .setThumbnail(add.result.rankimage)
        .setDescription("__"+add.result.point+"점이 되셨습니다.__")
        .addField("얻은 포인트", `+${random}점`);
        message.channel.send({embeds: [correctEmbed]});
        }else{
          message.channel.send(quiz.error[0]);
        }
      }else{
        if(isAnswer["result"]["correct"]!=null){
          message.channel.send(message.author.username+"님, "+isAnswer["result"]["correct"]["length"]+"개 ("+isAnswer["result"]["correct"]["percentage"]+"%) 맞았습니다.")
        }else{
          message.channel.send(isAnswer["reason"]);
        }
      }
    }
  }
  if (msg.startsWith(config.prefix)) {
    let command = msg.slice(config.prefix.length).trim();
    command = command.includes(" ")?command.replace(/ /gi, ""):command;
    //startsWith cmd
    switch (command) {
      case "":
        let Embed = new MessageEmbed()
        .setFooter(`${bot.guilds.cache.size}개 서버에서 운영중...`, bot.user.displayAvatarURL({dynamic: false, format: "png"}))
        .setTitle("안녕하세요, 셉봇입니다.")
        .setDescription(`**사용방법: __${config.prefix}명령어__**`)
        .setColor("#F44444");
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
        .setColor("d144f4")
				.setFooter("Ver-"+version,bot.user.displayAvatarURL({dynamic : false, format : "png"}))
				for(let i = 0; i < help.length;i++){
          cmdEmbed.addFields(
            {
              name : `> **__${help[i]["cmd"]}__**`, value : help[i]["description"], inline : false
            }
          )
        }
        message.channel.send({embeds: [cmdEmbed]});
        break;
      case "정보":
      case "내정보":
          var user = await quiz.getUser(userID);
          if(user["isSign"]){
          var userData = user["user-object-0"];
          let statusEmbed = new MessageEmbed()
          .setTitle("[ "+userData.rankname+" ] "+userData.name)
          .addField(userData.name, userData.rankname)
          .setDescription("Point : "+userData.point)
          .setColor("d144f4")
          .setAuthor(userData.rankname,userData.rankimage)
					.setThumbnail(userData.rankimage)
          .setFooter("To. "+userData.name)
          .setTimestamp();
          message.channel.send({embeds: [statusEmbed]});
          }else{
            message.channel.send(quiz.error[0]);
          }
        break;
      case "서버":
        var joinDate = new Date(message.guild.joinedAt);
        let infoEmbed = new MessageEmbed()
        .setColor("#F44444")
        .setTitle(message.guild.name+"서버의 정보")
        .setThumbnail(message.guild.iconURL({dynamic: false}))
        .addFields({
          name: "서버 이름", value: message.guild.name, inline: true
        },{
          name: "서버 참가", value: dateFormat.date(joinDate), inline: true
        },{
          name: "서버 멤버수", value: message.guild.memberCount, inline: false
        },{
          name: "만들어진 날짜", value: dateFormat.date(message.guild.createdAt), inline: true
        })
        .setTimestamp();
        message.channel.send({embeds: [infoEmbed]});
        break;
      case "내역":
      case "로그":
      case "업데이트":
          let logEmbed = new MessageEmbed()
          .setColor("#F44444")
          .setTitle("셉봇의 업데이트 내역")
          .addField("> 업데이트 ("+version+")", "Axios패키지 사용", false)
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
          .setDescription(`이제 "${prefix}퀴즈" 명령어로 시작해보세요!`);
          message.channel.send({embeds: [signupEmbed]});
        }
      break;
      case "초성":
      let setWord = await quiz.setWord(channelID);
        var wordEmbed = new MessageEmbed()
        .setTitle(setWord["getWord"]==true?"초성퀴즈 진행중!":"초성퀴즈 시작!")
        .setDescription("S[답] 혹은 s[답]으로 답을 맞추시면 됩니다.")
        .addFields({
          name : "__"+setWord["result"]["word"]+"__", value : "종류 : "+setWord["result"]["type"], inline : true
        })
        .setColor("F44444")
				.setFooter(`어려우시다면 ${prefix}힌트 / ${prefix}패스를 해주세요!`);
        message.channel.send({embeds: [wordEmbed]});
      break;
      case "힌트":
        let hint = await quiz.hint(channelID);
        if(hint.isPlaying){
          let hintEmbed = new MessageEmbed()
          .setTitle("초성퀴즈 힌트")
          .setDescription("힌트 : __"+hint.result+"__")
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
          .setDescription("정답 : __"+pass.result+"__")
          .setColor("F44444");
          message.channel.send({embeds: [passEmbed]});
        }else{
          message.channel.send(pass.reason);
        }
      break;
			case "설정":
			var nicknames = quiz.ranknames;
      var nickmenus = nicknames.map((e,i) => {
        return {
          label: e,
          description: "칭호: "+e,
          value: e
        }
      });
      var setNickname = new MessageActionRow()
      .addComponents(
        new MessageSelectMenu()
        .setCustomId("Nickname")
        .setPlaceholder("칭호 없음")
        .addOptions(nickmenus)
      );
      var setNicknameEmbed = new MessageEmbed()
      .setTitle("칭호를 설정해주세요")
      .setDescription("아래 메뉴바에서 칭호를 설정해주세요")
      .setColor("F44444")
      .setTimestamp();
      await message.channel.send({embeds: [setNicknameEmbed], components: [setNickname]});
	break;
      case "랭크":
      case "랭킹":
        var ranking = await quiz.getRank(userID);
        if(ranking["isSign"]){
					if(ranking["isRanked"]){
						var rank = ranking["ranks"].map((e,i) => {
							return (i+1)+"등 : [ "+e.rankname+" ] "+e.name+" | "+e.point
						});
						message.channel.send(rank.join("\n===============\n"));
					}else{
						var rank = ranking["ranks"].map((e,i) => {
							if(i <= 4){
							return (i+1)+"등 : [ "+e.rankname+" ] "+e.name+" | "+e.point
							}else{
								return "__"+(ranking["userIndex"]+1)+"등 : [ "+e.rankname+" ] "+e.name+" | "+e.point+"__";
							}
						});
						message.channel.send(rank.join("\n===============\n"));
					}
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
        message.author.send(result.join("\n===============\n"));
        var nicknameList_goestoDM = await message.channel.send("DM으로 전송되었습니다");
				await wait(5000);
				await nicknameList_goestoDM.delete();
      break;
    }  //switch
  }
  }catch(e){
    console.log(e);
  } 
});
keepAlive();
bot.login(config.token);