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
    ]
});
setInterval(() => {
	try{
    axios.post(`https://koreanbots.dev/api/v2/bots/${bot.user.id}/stats`, {
        servers: bot.guilds.cache.size,
        shards: 1
    }, {
        headers: {
            'Content-Type': "application/json",
            "Authorization": config.koreanbotsKey
        }
    })
	}catch(error){
		fs.writeFileSync("../error/"+Date.now()+".txt", JSON.stringify(error,null,2));
	}
}, 300000);
try{
	bot.on("ready", () => readyEvent(bot));
	bot.on("guildCreate", guildCreateEvent);
	bot.on("interactionCreate", async (interaction) => interactionCreateEvent(bot, interaction));
}catch(error){
	fs.writeFileSync("../error/"+Date.now()+".txt", JSON.stringify(error,null,2));
}
keepAlive();
bot.login(config.token);