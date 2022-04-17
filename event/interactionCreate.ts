import { Client, MessageActionRow, 
    MessageButton, MessageSelectMenu, 
    MessageEmbed, MessageFlags, 
    MessageAttachment, MessageCollector, 
    Intents, 
    Interaction} from "discord.js";
import * as util from "../src/util";
import update from "../data/update";
import cmd from "../data/command";
import config from "../config/secret";
import axios from "axios";
const version = update[0].version;
const prefix = config.prefix;
async function translator(from:string, to:string, msg:string):Promise<string>{
    let postData = await axios.post("https://openapi.naver.com/v1/papago/n2mt",{
      'source': from,
      'target': to,
      'text': msg
    },{
      headers: {
        'X-Naver-Client-Id': config.naverId,
        'X-Naver-Client-Secret': config.naverPw
      }
    });
    return postData.data.message.result.translatedText;
}
export default async function interactionCreate(bot:Client, inter:Interaction){
    if(inter.isSelectMenu()){
        //SelectMenu
      }else if(inter.isButton()){
          //Button
      }else if(inter.isCommand()){
        let { commandName, options, channelId: channelID } = inter;
        let userID = inter.user.id;
        if(commandName == "명령어"){
          let cmdEmbed = new MessageEmbed()
            .setTitle("셉봇 명령어 리스트")
            .setColor("#d144f4")
                    .setFooter("Ver-"+version,bot.user.displayAvatarURL({dynamic : false, format : "png"}))
                    for(let i = 0; i < cmd.length;i++){
              cmdEmbed.addFields(
                {
                  name : `> **__/${cmd[i]["name"]}__**`, value : cmd[i]["description"], inline : true
                }
              )
            }
          await inter.reply({embeds : [cmdEmbed]});
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
        }else if(commandName == "셉봇"){
          let Embed = new MessageEmbed()
            .setFooter(`${bot.guilds.cache.size}개 서버에서 운영중...`, bot.user.displayAvatarURL({dynamic: false, format: "png"}))
            .setTitle("안녕하세요, 셉봇입니다.")
            .setDescription(`**사용방법: __${config.prefix}명령어__**`)
            .addFields([
              {
                name: `최근 업데이트(v ${update[0].version})`, value: update[0].description, inline: true
              }
            ])
            .setColor("#F44444")
            .setTimestamp();
          inter.reply({embeds: [Embed]});
        }else if(commandName == "서버"){
          let infoEmbed = new MessageEmbed()
          .setColor("#F44444")
          .setTitle(inter.guild.name+"서버의 정보")
          .setThumbnail(inter.guild.iconURL({dynamic: false}))
          .addFields({
            name: "서버 이름", value: inter.guild.name, inline: true
          },{
            name: "서버 참가", value: util.dateFormat(new Date(inter.guild.joinedAt)), inline: true
          },{
            name: "서버 멤버수", value: inter.guild.memberCount+"명", inline: false
          },{
            name: "만들어진 날짜", value: util.dateFormat(inter.guild.createdAt), inline: true
          })
          .setTimestamp();
          inter.reply({embeds: [infoEmbed]});
        }else if(commandName == "업데이트"){
              let logEmbed = new MessageEmbed().setColor("#F44444").setTitle("셉봇의 업데이트 내역").setTimestamp().setFooter("버전 : "+update[0].version); 
            for(let i=0;i<update.length;i++){
              logEmbed.addField("업데이트 (v "+update[i].version+")", update[i].description, true);
            }
            inter.reply({embeds: [logEmbed]});
            }else if(commandName == "개발자"){
            let profileEmbed = new MessageEmbed()
            .setAuthor("SepJ", "https://sepimage.netlify.app/image/SepcodLogo.png")
            .setColor("#F44444")
            .setTitle("__셉봇 개발자 SepJ__")
            .setThumbnail("https://sepimage.netlify.app/image/SepcodLogo.png")
            .setFooter("Sepbot Developer")
            .setDescription("웹사이트나 채팅봇들을 만드는 평범한 학생입니다.")
            .addFields({
              name : "Sepbot / 셉봇", "value" : "각종 기능 중심으로 만들어진 봇", inline: true
            },{
              name: "Sonnet / 소네트", value: "음악을 들을 수 있는 봇 **__(삭제 예정)__**", inline: true
            },{
              name: "SepRPG / SPG (개발중)", value: "RPG 게임을 할 수 있는 봇(개발 보류)", inline: true
            })
            .setTimestamp();
            let urlRedirectButton = new MessageActionRow()
            .addComponents([
              new MessageButton()
              .setStyle("LINK").setURL("https://sepcod.com").setLabel("홈페이지"),
              new MessageButton().setStyle("LINK").setURL("https://koreanbots.dev/bots/850706596463116309").setLabel("Sonnet초대"),
              new MessageButton().setStyle("LINK").setURL("http://seprpg.kro.kr").setLabel("SPG사이트"),
              new MessageButton().setStyle("LINK").setURL("https://github.com/CsepJ").setLabel("Github")
            ]);
            inter.reply({embeds: [profileEmbed], components: [urlRedirectButton]});
          }else if(commandName == "코로나"){
              let covid = await axios.get(`https://api.corona-19.kr/korea/beta/?serviceKey=${config.covidKey}`);
              let vaccine = await axios.get(`https://api.corona-19.kr/korea/vaccine/?serviceKey=${config.covidKey}`);
              let covidEmbed = new MessageEmbed()
              .setTitle("한국 코로나19 현황")
              .setFields([
                {
                    name: "확진자 수",
                    value: "> "+util.comma(covid.data.korea.totalCnt)+"명",
                    inline:true
                },
                {
                    name: "사망자 수",
                    value: "> "+util.comma(covid.data.korea.deathCnt)+"명",
                    inline:true
                },
                {
                    name: "백신 접종자 수 - 1차",
                    value: "> "+util.comma(vaccine.data.korea["vaccine_1"]["vaccine_1"])+"명",
                    inline: false
                },
                {
                    name: "백신 접종자 수 - 2차",
                    value: "> "+util.comma(vaccine.data.korea["vaccine_2"]["vaccine_2"])+"명",
                    inline: true
                },
                {
                    name: "백신 접종자 수 - 3차",
                    value: "> "+util.comma(vaccine.data.korea["vaccine_3"]["vaccine_3"])+"명",
                    inline: true
                }
            ])
            .setColor("DARK_VIVID_PINK")
            inter.reply({embeds: [covidEmbed]});
          }else if(commandName == "소인수분해"){
            let number = parseInt(inter.options.getInteger("숫자").toString().replace(/,/gi,""));
            let result = util.primeFactors(number)
            let factorEmbed = new MessageEmbed()
            .setTitle("소인수분해 결과")
            .setDescription("```"+result+"```")
            .setColor("#3370FF")
            inter.reply({embeds: [factorEmbed]});
          }else if(commandName == "초대"){
              let inviteEmbed = new MessageEmbed()
              .setTitle("셉봇 초대 링크")
              .setColor("#3370FF")
              .setDescription(">>> ```아래 버튼을 클릭해주세요\n\n버튼을 클릭하시면 봇 초대 페이지로 이동합니다.```");
              let inviteButton = new MessageActionRow()
              .addComponents(
                  new MessageButton()
                  .setStyle("LINK")
                  .setURL("https://discord.com/oauth2/authorize?client_id=764104980218118194&permissions=8&scope=bot%20applications.commands")
                  .setLabel("셉봇 초대")
              );
              inter.reply({embeds: [inviteEmbed], components: [inviteButton]});
          }
      }
}