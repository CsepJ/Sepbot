import discord from "discord.js";
import command from "../data/command";
import config from "../config/secret";
export default async function ready(bot:discord.Client):Promise<void>{
    bot.user.setPresence({
        "activities": [
            {
                name: "/를 입력",
                type: "PLAYING"
            }
        ],
        status: "online"
    });
    // bot.application.commands.fetch()
    // .then(command => {
    //     command.forEach(e => {
    //         bot.application.commands.delete(e.id)
    //     });
    // })
    await bot.application.commands.set(command);
    console.log("Sepbot is running\n----------\nNode-Version: "+process.version+"\nBot-Name: "+bot.user.username+"\nBot-ID: "+bot.user.id+"\n==========\nBot-Version: "+config.version+"\nBot-Servers: "+bot.guilds.cache.size+"개");
    return;
}
