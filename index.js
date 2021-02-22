const { Client, MessageEmbed, MessageAttachment, MessageCollector } = require("discord.js");
const client = new Client();
const Youtube = require("simple-youtube-api");
const youtube = new Youtube(process.env.youtube);
const keepAlive = require("./server.js");
const version = "4.1.14";
const prefix = "sp";
const fs = require("fs");
var lol = require("./lol.js");
var code = require("unescape");
var ytdl = require("ytdl-core");
var connection = {};
var dispatcher;
var onoff = [];
var results_of_searching = [];


//setup functions
function delay(func, ms){
    setTimeout(func,ms);
}
function Search_Videos(value, index){
    return new Promise(resolve => {
        youtube.searchVideos(value, index)
    .then(youtube_results => {
        for(var i = 0;i < index;i++){
          results_of_searching.push("**["+(i+1)+"]**  : " + code(youtube_results[i].title) + "\n"+youtube_results[i].channel.title)
        }
        resolve(results_of_searching);
    });
});
}

client.on('ready', () => {
    client.user.setActivity("Sepbot is Running",{type:"WATCHING"});
});

client.on("guildCreate", guild => {
    guild.systemChannel.send("Hello. I am Sepbot.");
    });


client.on('message', async message => {
    try{
	const msg = message.content;
    if(msg === "셉봇" || msg === "셉 봇" || msg === "셉벗" || msg === "셉 벗" || msg.toLowerCase() == "spqqht"){
        message.reply("안녕하세요 셉봇입니다\n\n명령어를 확인해보시려면 '셉봇명령어'라고 해보세요!");
    }
    if(msg.toLowerCase() == "sepbot" || msg.toLowerCase() == "Sepbot"){
        message.reply("Hi I am Sepbot.\n\nIf you want to check bot commands, Enter 'Cshelp'or'Csmand'.");
    }



    if(msg === "셉봇명령어" || msg === "셉봇 명령어" || msg === "셉봇도움말" || msg === "셉봇 도움말"){
        var commandembed = new MessageEmbed()
        .setColor('#8C60F5')
        .setTitle("Sepbot Command")
        .setURL('https://sepmand.netlify.app')
        .setDescription("셉봇의 명령어 입니다\n")
        .addFields({
                name: '>>> 셉봇주사위', value: '=> 주사위', inline:false
            },{
                name: ">>> 셉봇내역", value: '=> 업데이트 내역', inline:true
            },{
                name:`>>> 셉봇롤 [닉네임]`, value:`=> 리그오브레전드 전적`,inline : true
            },{
                name:`셉봇음악`, value:`=> 음악재생 도움말 목록`
            })
        .setTimestamp()
        .setFooter('Version: '+version);
        message.channel.send(commandembed);
        }
        if(msg.toLowerCase() == prefix+"mand" || msg.toLowerCase() == prefix+"help"){
                var helpembed = new MessageEmbed()
                .setColor('#8C60F5')
                .setTitle("Sepbot Command")
                .setURL('https://sepmand.netlify.app')
                .setDescription("Sepbot Command\n")
                .addFields({
                    name: '>>> '+prefix+'dice', value: '=> Dice', inline:false
                },{
                name: ">>> "+prefix+"date", value: '=> Update Log', inline:true
            },{
                name:`>>> ${prefix}lol [nickname]`, value:`=> LOL game stat`,inline : true
            },{
                name:`${prefix}music`, value: `=> Music player command`, inline:false
            })
                .setTimestamp()
                .setFooter('Version: '+version);
                message.channel.send(helpembed);
        }

        if(msg == "셉봇음악" || msg == "셉봇 음악" || msg == "셉봇 노래" || msg == "셉봇노래"){
            var songEmbed_ko = new MessageEmbed()
            .addFields({
                name:`>>> 셉봇참가`,value: `=> 음성채널 참가`, inline:false
            },{
                name:">>> 셉봇퇴장", value:"=> 음성채널 퇴장", inline:true
            },{
                name:">>> 셉봇재생 (음악)" , value:"=> 음악 재생", inline:false
            })
            .addFields({
                name : `>>> 셉봇정지`, value: "=> 음악 일시정지", inline:true
            },{
                name: ">>> 셉봇시작", value:"=> 음악 일시정지 해제", inline:true
            })
            .setColor("#0E9ECC")
            .setTitle("셉봇 음악 명령어")
            .setFooter("버전 : "+version)
            .setURL("https://sepmand.netlify.app");
            message.channel.send(songEmbed_ko);
        }
            if(msg == prefix+"Music" || msg == prefix+"music" || msg == prefix+"song" || msg == prefix+"Song"){
            var songEmbed_en = new MessageEmbed()
            .addFields({
                name:`>>> ${prefix}join`,value: `=> Join VOice Channel`, inline:false
            },{
                name:">>> "+prefix+"exit", value:"=> Leave Voice Channel", inline:true
            },{
                    name:">>> "+prefix+"play (song)" , value:"=> Play song", inline:false
                })
                .addFields({
                    name : `>>> Cspause`, value: "=> Pause Song", inline:true
                },{
                    name: ">>> Csresume", value:"=> Unpause song", inline:true
                })
                .setColor("#0E9ECC")
                .setTitle("Sepbot Music Command")
                .setURL("https://sepmand.netlify.app")
                .setFooter("Version : "+version);
                message.channel.send(songEmbed_en);
        }

    if(msg === "셉봇주사위" || msg === "셉봇 주사위"){
        let dicedata = ["1️⃣","2️⃣","3️⃣","4️⃣","5️⃣","6️⃣"];
        message.channel.send(dicedata[Math.floor(Math.random() * 6)]);
}
if(msg.toLowerCase() == prefix+"dice"){
    let dicedata = ["1️⃣","2️⃣","3️⃣","4️⃣","5️⃣","6️⃣"];
    message.channel.send(dicedata[Math.floor(Math.random() * 6)]);
}


if(msg === "셉봇내역" || msg === "셉봇 내역" || msg === "셉봇업데이트" || msg === "셉봇 업데이트"){
    var updateR = new MessageEmbed()
    .setColor("#2DE253")
    .setTitle("셉봇 업데이트 내역")
    .setURL("https://sepdate.netlify.app/ko/korupdate")
    .setDescription("[더보기](https://sepdate.netlify.app/ko/korupdate)")
    .addField("> 업데이트 "+version, "접두사 변경 (cs => sp), 음악재생기능 명령어 추가, 확인메세지 추가 ", false)
    .setTimestamp()
    .setFooter("버전 : "+version);
    message.channel.send(updateR);
}
if(msg.toLowerCase() == prefix+"log"){
    updateR = new MessageEmbed()
    .setColor("#2DE253")
    .setTitle("Sepbot Update Log")
    .setURL("https://sepdate.netlify.app/en/engupdate")
    .setDescription("[More](https://sepdate.netlify.app/en/engupdate)")
    .addField("> Update log "+version, "Change Prefix (cs => sp), Add Music command, Add check message", false)
    .setTimestamp()
    .setFooter("Version : "+version);
    message.channel.send(updateR);
}

if(msg === "셉봇롤"){
    message.channel.send("롤 닉네임을 뒤에 입력해야 됩니다.\n\nex) 셉봇롤 TKYJ");
}
if(msg.toLowerCase() === prefix+"lol"){
    message.channel.send("You should enter your lol name.\n\nex) Cslol TKYJ");
}
if(msg.startsWith("셉봇롤 ")){
    if(msg != `셉봇롤`){
        var data = msg.substr(4);
        lol.lolstat(data)
        .then(function(receive){
            let result = JSON.parse(receive);
            const lolembed = new MessageEmbed()
        .setColor("#0F7CEE")
        .setThumbnail(result["profile"])
        .addFields({
            name : "> Odds of winning", value : result["winodds"], inline: false
        },{
            name : "> Level", value : result["level"]+"level", inline : false
        },{
            name : "> SoloRank", value : result["rank"], inline: false
        })
        .setTitle("**"+result["lolname"]+"**")
        .setTimestamp()
        message.channel.send(lolembed);
        });
        }
}
if(msg.toLowerCase().startsWith(prefix+"lol ")){
    if(msg.toLowerCase() != `${prefix}lol`){
    data = msg.substr(6);
    lol.lolstat(data)
    .then(function(receive){
        let result = JSON.parse(receive);
        const lolembed = new MessageEmbed()
    .setColor("#0F7CEE")
    .setThumbnail(result["profile"])
    .addFields({
        name : "> Odds of winning", value : result["winodds"], inline: false
    },{
        name : "> Level", value : result["level"]+"level", inline : false
    },{
        name : "> SoloRank", value : result["rank"], inline: false
    })
    .setTitle("**"+result["lolname"]+"**")
    .setTimestamp()
    message.channel.send(lolembed);
    });
    }
}
if(msg.startsWith("Yv ")){
    if(message.author.id == "636188640619266060"){
    var runtime = Date.now();
    var eval_data = msg.substr(3);
    if(message.channel.type == "dm"){
        try{
    message.channel.send("Result : "+eval(eval_data)); message.channel.send(Date.now() - runtime+"ms");
    }catch(err){
        message.channel.send("Error!\n"+err.message);
    }
}else{
        message.channel.send("Go to DMchannel!\n\n[개인 메세지 채널로 가주세요!]");
}
}else{
    message.channel.send("You aren't admin!\n\n[관리자가 아닙니다!]")
}
}
if(msg.toLowerCase() == `${prefix}join`){
    if(message.member.voice.channel){
    connection[message.author.id] = await message.member.voice.channel.join();
    connection[message.author.id].setSpeaking("SPEAKING");
    message.channel.send("Complete!");
}else{
message.channel.send("**Please enter the audio channel first**");
}
}
if(msg == `셉봇참가`){
    if(message.member.voice.channel){
    connection[message.author.id] = await message.member.voice.channel.join();
    connection[message.author.id].setSpeaking("SPEAKING");
    message.channel.send("성공하였습니다!");
}else{
message.channel.send("**음성채널에 먼저 들어가주세요**");
}
}
if(msg.toLowerCase() == `${prefix}pause`){
        if(!message.member.voice.channel){
        message.channel.send("**Please enter the audio channel first**");
        }else{
            if(dispatcher.paused){
                message.channel.send("**Already paused**");
            }else{
            dispatcher.pause();
            message.channel.send("Music is paused.\n\nStatus : Paused");
        }
    }
}
if(msg == "셉봇정지"){
    if(!message.member.voice.channel){
        message.channel.send("**먼저 음성채널에 들어가주세요**");
        }else{
            if(dispatcher.paused){
                message.channel.send("**이미 정지되어있습니다**");
            }else{
            dispatcher.pause();
            message.channel.send("음악이 잠시 정지됐습니다.\n\n현재 상태 : 정지");
        }
    }
}
if(msg.toLowerCase() == `${prefix}resume`){
    if(!message.member.voice.channel){
        message.channel.send("**Please enter the audio channel first**");
    }
    else if(!dispatcher.paused){
    message.channel.send("**The song is not paused**");
    }else{
        dispatcher.resume();
        message.channel.send("Music is resumed.\n\nStatus : Resumed");
    }
}
if(msg == "셉봇시작"){
    if(!message.member.voice.channel){
        message.channel.send("**먼저 음성채널에 들어가주세요**");
    }
    else if(!dispatcher.paused){
    message.channel.send("**노래가 정지되지 않았습니다**");
    }else{
        dispatcher.resume();
        message.channel.send("음악재생을 계속합니다\n\n현재 상태 : 재생");
    }
}
if(msg.toLowerCase() == `${prefix}exit`){
    try{
    if(message.member.voice.channel == undefined){
      message.channel.send("Sepbot **isn't** join a voice channel");
    }
    message.member.voice.channel.leave();
    message.channel.send("Left the voice channel");
}catch(e){
    console.log(e);
}
}
if(msg == "셉봇퇴장"){
    try{
      if(message.member.voice.channel == undefined){
        message.channel.send("봇이 **음성채널에 없습니다**");
      }else{
        message.member.voice.channel.leave();
        message.channel.send("음성채널에 나갔습니다.");
      }
    }catch(e){
        console.log(e);
    }
}
if(msg.toLowerCase().startsWith(`${prefix}play `)){
    var message_play = msg.substr(7);
    if(message.channel.type == "dm"){
      message.channel.send("Please **go to text channel.** Not DMchannel.");
    }else{
    if(isNaN(Number(message_play))){
    if(!message.member.voice.channel){
        message.channel.send("**Please enter the audio channel first**");
    }else{
        Search_Videos(message_play, 5).then(play_search => {
            message.channel.send(play_search);
        });
        results_of_searching = [];
        onoff.unshift({"id" : message.author.id, "query" : message_play});
}
}else{
    if(!message.member.voice.channel){
        message.channel.send("**Please enter the audio channel first**");
    }else{
        if(connection[message.author.id] == undefined){
            message.channel.send("**Please check if Sepbot is in join state**");
        }
    if(onoff.find((e) => e.id === message.author.id)){
        var play_data = onoff.find(function(e){
            if(e.id === message.author.id) return e.query;   
        });
        console.log(play_data);
        youtube.searchVideos(play_data.query, 5)
        .then(play_music_results => {
            dispatcher = connection[message.author.id].play(ytdl(play_music_results[Number(message_play) - 1].url, { filter: "audioonly" }));
        });
    }else{
        message.channel.send("**First, enter Csplay (title) to confirm\n, then enter Csplay (song number)**");
    }
}
}
}
}
if(msg.startsWith("셉봇재생 ")){
    var message_Music_play = msg.substr(5);
    if(message.channel.type == "dm"){
      message.channel.send(message.channel.type+"채널에서 말고 일반채널에서 해주세요");
    }else{
    if(isNaN(Number(message_Music_play))){
    if(!message.member.voice.channel){
        message.channel.send("**먼저 음성채널에 들어가주세요**");
    }else{
        Search_Videos(message_Music_play, 5).then(play_search => {
            message.channel.send(play_search);
        });
        results_of_searching = [];
        onoff.unshift({"id" : message.author.id, "query" : message_Music_play});
}
}else{
    if(!message.member.voice.channel){
        message.channel.send("**먼저 음성채널에 들어가주세요**");
    }else{
        if(connection[message.author.id] == undefined){
            connection[message.author.id] = await message.member.voice.channel.join();
        }
    if(onoff.find((e) => e.id === message.author.id)){
        var Music_play_data = onoff.find(function(e){
            if(e.id === message.author.id) return e.query;
        });
        youtube.searchVideos(Music_play_data.query, 5)
        .then(play_music_results => {
            dispatcher = connection[message.author.id].play(ytdl(play_music_results[Number(message_Music_play) - 1].url, { filter: "audioonly" }));
        });
    }else{
        message.channel.send("**먼저 셉봇재생 (제목)을 입력하셔서\n확인하신뒤, 셉봇재생 (곡 순서)를 입력해주세요**");
    }
}
}
}
}
    }catch(err){
        console.log("[Error!!!]\n\n"+err.stack+"\n\n\n"+err.message);
    }
});



keepAlive();
client.login(process.env.sepbot);