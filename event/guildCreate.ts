import { Client, MessageActionRow, 
    MessageButton, MessageSelectMenu, 
    MessageEmbed, MessageFlags, 
    MessageAttachment, MessageCollector, 
    Intents, Guild} from "discord.js";
import config from "../config/secret";
export default function (guild:Guild){
    if(guild.me.permissions.has("SEND_MESSAGES")){
		if(guild.systemChannel){
    const welcomeEmbed = new MessageEmbed()
    .setColor("#F44444")
    .setTitle("안녕하세요 셉봇입니다")
    .setFields({
        name: "슬래시 명령어로 사용하실 수 있습니다.", value: "/를 채팅창에 입력하시면 명령어 목록이 나옵니다."
      },{
        name: "You can use Sepbot by using slash command.", value: "Type **/** into the chat field!"
      })
    .setDescription(`도움말: ${config.prefix}명령어`);
    guild.systemChannel.send({embeds: [welcomeEmbed]});
		}
  }
}