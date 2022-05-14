import { Client, MessageActionRow, MessageButton, MessageSelectMenu, MessageEmbed, MessageFlags, MessageAttachment, MessageCollector, Intents } from "discord.js";
import axios from "axios";
import fs from "fs";
import config from "../config/secret";
import * as util from "./util";
import sqlite from "sqlite3";
import interactionCreateEvent from "../event/interactionCreate";
import guildCreateEvent from "../event/guildCreate";
import readyEvent from "../event/ready";
import keepAlive from "./server";
const db = new sqlite.Database("./data/data.db");
const bot = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.DIRECT_MESSAGES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        Intents.FLAGS.GUILD_PRESENCES
    ],
	shards: "auto"
});
setInterval(async () => {
    try{
        await axios.post(`https://koreanbots.dev/api/v2/bots/${bot.user.id}/stats`, {
            servers: bot.guilds.cache.size,
            shards: 1
        }, {
            headers: {
                'Content-Type': "application/json",
                "Authorization": config.koreanbotsKey
            }
        });
    }catch(error){
        fs.writeFile("./error/"+(new Date().toLocaleString("ko-KR").replace(/( |:)/gi, "_").replace(/([ㄱ-힣]|\.)/gi, ""))+".txt", String(error), (err) => {
            if(err) throw err;
        });
    }
}, 3600000)
try{
	bot.on("ready", () => readyEvent(bot));
	bot.on("guildCreate", guildCreateEvent);
	bot.on("interactionCreate", async (interaction) => interactionCreateEvent(bot, interaction));
}catch(error){
    fs.writeFile("./error/"+(new Date().toLocaleString("ko-KR").replace(/( |:)/gi, "_").replace(/([ㄱ-힣]|\.)/gi, ""))+".txt", String(error), (err) => {
        if(err) throw err;
    });
}
keepAlive();
bot.login(config.token);